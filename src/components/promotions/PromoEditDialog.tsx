// src/components/promotions/PromoEditDialog.tsx
import React, { useEffect, useState } from 'react'
import { Constraints } from '../../models'
import { EditingPromotion } from '../../hooks/promotions/usePromotionEditing'
import { computePromoTotals } from '../../utils/promoUtils'

import PromoMainInfo from './sections/PromoMainInfo'
import PromoGroups from './sections/PromoGroups'
import PromoSpecialties from './sections/PromoSpecialties'
import ConstraintsSection from './constraints/ConstraintsSection'

import ActionButtonsWithConfirm from '../common/ActionButtonsWithConfirm'
import ConfirmDialog from '../common/ConfirmDialog'

interface PromoEditDialogProps {
    editingPromo: EditingPromotion
    hasChanges: boolean
    onSubmit: () => void
    onClose: () => void
    onFieldChange: (field: string, value: any) => void
    onStudentsBlur?: () => void
    onGroupChange: (index: number, field: string, value: any) => void
    onAddGroup: () => void
    onRemoveGroup: (index: number) => void
    onSpecialtyChange: (index: number, field: string, value: any) => void
    onAddSpecialty: () => void
    onRemoveSpecialty: (index: number) => void
    constraints: Constraints
    onAddConstraint: (type: keyof Constraints) => void
    onRemoveConstraint: (type: keyof Constraints, id: string) => void
    onUpdateConstraintRange: (
        type: keyof Constraints,
        id: string,
        field: string,
        value: string
    ) => void
}

const PromoEditDialog: React.FC<PromoEditDialogProps> = (props) => {
    const { editingPromo } = props

    const [openCloseConfirm, setOpenCloseConfirm] = useState(false)
    const [hasButtonsPopupOpen, setHasButtonsPopupOpen] = useState(false)

    if (!editingPromo) return null

    const totals = computePromoTotals({
        students: editingPromo.students,
        groups: editingPromo.groups,
        specialties: editingPromo.specialties,
    } as any)

    const handleSave = () => {
        console.log('[PROMOS] Enregistrer les modifications')
        console.log('→ mettre à jour la BDD côté back')
        props.onSubmit()
    }

    const handleRequestClose = () => {
        if (!props.hasChanges) {
            props.onClose()
            return
        }
        setOpenCloseConfirm(true)
    }

    const handleConfirmSaveAndClose = () => {
        setOpenCloseConfirm(false)
        handleSave()
        props.onClose()
    }

    const handleDiscardAndClose = () => {
        setOpenCloseConfirm(false)
        props.onClose()
    }

    const handleCloseConfirmPopupOnly = () => {
        setOpenCloseConfirm(false)
    }

    // ESC → ferme la card seulement si aucun popup n'est ouvert
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return

            // Si un popup (boutons) ou le popup de croix est ouvert, on ne ferme pas la card ici
            if (openCloseConfirm || hasButtonsPopupOpen) {
                return
            }

            props.onClose()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [openCloseConfirm, hasButtonsPopupOpen, props.onClose])

    return (
        <div className="promo-edit-overlay">
            <form
                className="card promo-edit-card"
                onSubmit={(e) => e.preventDefault()}
            >
                {/* ❌ croix en haut à droite */}
                <button
                    type="button"
                    className="promo-edit-close"
                    onClick={handleRequestClose}
                    aria-label="Fermer la fenêtre de modification"
                >
                    ✕
                </button>

                <h3 className="promo-edit-title">Modifier la promotion</h3>

                <div className="promo-edit-layout">
                    <PromoMainInfo
                        editingPromo={editingPromo}
                        onFieldChange={props.onFieldChange}
                        onStudentsBlur={props.onStudentsBlur}
                    />

                    <div className="promo-edit-side">
                        <PromoGroups
                            groups={editingPromo.groups}
                            onAddGroup={props.onAddGroup}
                            onGroupChange={props.onGroupChange}
                            onRemoveGroup={props.onRemoveGroup}
                        />

                        <PromoSpecialties
                            specialties={editingPromo.specialties}
                            onAddSpecialty={props.onAddSpecialty}
                            onSpecialtyChange={props.onSpecialtyChange}
                            onRemoveSpecialty={props.onRemoveSpecialty}
                        />
                    </div>

                    <ConstraintsSection
                        promoName={editingPromo.name}
                        constraints={props.constraints}
                        onAddConstraint={props.onAddConstraint}
                        onRemoveConstraint={props.onRemoveConstraint}
                        onUpdateConstraintRange={props.onUpdateConstraintRange}
                    />
                </div>

                {(totals.groupsMismatch || totals.specialtiesMismatch) && (
                    <div className="promo-mismatch-block">
                        {totals.groupsMismatch && (
                            <p className="promo-mismatch">
                                Le total des groupes est {totals.groupsTotal} pour{' '}
                                {totals.totalStudents}.
                            </p>
                        )}
                        {totals.specialtiesMismatch && (
                            <p className="promo-mismatch">
                                Le total des spécialités est {totals.specialtiesTotal} pour{' '}
                                {totals.totalStudents}.
                            </p>
                        )}
                    </div>
                )}

                <div className="promo-edit-actions">
                    <ActionButtonsWithConfirm
                        onCancel={props.onClose}
                        onSave={handleSave}
                        hasChanges={props.hasChanges}
                        confirmMessage={
                            <>
                                Vous êtes sur le point d’enregistrer les modifications
                                apportées à la promotion{' '}
                                <strong>{editingPromo.name}</strong>.
                                <br />
                                Confirmer&nbsp;?
                            </>
                        }
                        confirmLabel="Enregistrer"
                        cancelLabel="Annuler"
                        cancelDirtyTitle="Modifications non enregistrées"
                        cancelDirtyMessage={
                            <>
                                <p>Vous avez modifié cette promotion.</p>
                                <p>
                                    Souhaitez-vous enregistrer les changements avant de
                                    fermer&nbsp;?
                                </p>
                            </>
                        }
                        cancelDirtyConfirmLabel="Enregistrer et fermer"
                        cancelDirtyDiscardLabel="Fermer sans enregistrer"
                        // 👇 remonte l’état d’ouverture des popups liés aux boutons
                        onPopupStateChange={setHasButtonsPopupOpen}
                    />
                </div>
            </form>

            {/* Popup spécifique pour la croix */}
            <ConfirmDialog
                open={openCloseConfirm}
                title="Modifications non enregistrées"
                message={
                    <>
                        <p>Vous avez modifié cette promotion.</p>
                        <p>Souhaitez-vous enregistrer les changements avant de fermer&nbsp;?</p>
                    </>
                }
                confirmLabel="Enregistrer et fermer"
                cancelLabel="Fermer sans enregistrer"
                confirmClassName="btn-primary"
                cancelClassName="btn-danger"
                onConfirm={handleConfirmSaveAndClose}
                onCancel={handleDiscardAndClose}
                onRequestClose={handleCloseConfirmPopupOnly}
            />
        </div>
    )
}

export default PromoEditDialog