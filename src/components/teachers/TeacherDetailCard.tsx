// src/components/teachers/TeacherDetailCard.tsx
import React, { useEffect, useState } from 'react'
import { Teacher } from '../../models/Teacher'
import ActionButtonsWithConfirm from '../common/ActionButtonsWithConfirm'
import TeacherInfoColumn from './section/TeacherInfoColumn'
import TeacherSubjectsColumn from './section/TeacherSubjectsColumn'
import TeacherAvailabilityColumn from './section/TeacherAvailabilityColumn'
import { useTeacherDetail } from '../../hooks/teachers/useTeacherDetail'
import TeacherModeBadge from './TeacherModeBadge'
import ConfirmDialog from '../common/ConfirmDialog'

interface TeacherDetailCardProps {
    teacher: Teacher
    onClose: () => void
}

export default function TeacherDetailCard({ teacher, onClose }: TeacherDetailCardProps) {
    const {
        teacherDraft,
        periods,
        selectedPeriodId,
        handleInfoChange,
        handleSubjectChange,
        handleAddSubject,
        handleRemoveSubject,
        handleToggleSlot,
        handleSelectPeriod,
        handleAddPeriod,
        handleRemovePeriod,
        handlePeriodDateChange,
        handleSave,
        hasChanges,
    } = useTeacherDetail(teacher)

    const [openCloseConfirm, setOpenCloseConfirm] = useState(false)
    const [hasButtonsPopupOpen, setHasButtonsPopupOpen] = useState(false)

    const handleRequestClose = () => {
        if (!hasChanges) {
            onClose()
            return
        }
        setOpenCloseConfirm(true)
    }

    const handleConfirmSaveAndClose = () => {
        setOpenCloseConfirm(false)
        handleSave()
        onClose()
    }

    const handleDiscardAndClose = () => {
        setOpenCloseConfirm(false)
        onClose()
    }

    const handleCloseConfirmPopupOnly = () => {
        setOpenCloseConfirm(false)
    }

    // ESC → ferme la card uniquement si aucun popup n'est ouvert
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return

            if (openCloseConfirm || hasButtonsPopupOpen) {
                // Il y a déjà un popup (boutons ou croix) ouvert → on laisse ConfirmDialog gérer
                return
            }

            onClose()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [openCloseConfirm, hasButtonsPopupOpen, onClose])

    return (
        <div className="teacher-detail-overlay">
            <div className="teacher-detail-card">
                {/* ❌ croix en haut à droite */}
                <button
                    className="teacher-detail-close"
                    onClick={handleRequestClose}
                    aria-label="Fermer la fiche enseignant"
                    type="button"
                >
                    ✕
                </button>

                <TeacherModeBadge
                    mode={teacherDraft.mode}
                    variant="header"
                    title="Détail enseignant"
                    subtitle={`${teacherDraft.lastName.toUpperCase()} ${teacherDraft.firstName}`}
                    className="teacher-detail-header-badge"
                />

                <div className="teacher-detail-columns">
                    <TeacherInfoColumn
                        teacher={teacherDraft}
                        onInfoChange={handleInfoChange}
                    />

                    <TeacherSubjectsColumn
                        subjects={teacherDraft.subjects}
                        onSubjectChange={handleSubjectChange}
                        onAddSubject={handleAddSubject}
                        onRemoveSubject={handleRemoveSubject}
                    />

                    <TeacherAvailabilityColumn
                        periods={periods}
                        selectedPeriodId={selectedPeriodId}
                        onSelectPeriod={handleSelectPeriod}
                        onAddPeriod={handleAddPeriod}
                        onRemovePeriod={handleRemovePeriod}
                        onToggleSlot={handleToggleSlot}
                        onPeriodDateChange={handlePeriodDateChange}
                    />
                </div>

                <div className="teacher-detail-footer">
                    <ActionButtonsWithConfirm
                        onCancel={onClose}
                        onSave={handleSave}
                        hasChanges={hasChanges}
                        confirmMessage={
                            <>
                                Vous êtes sur le point d’enregistrer les modifications pour{' '}
                                <strong>
                                    {teacherDraft.firstName} {teacherDraft.lastName}
                                </strong>
                                .
                                <br />
                                Confirmer ?
                            </>
                        }
                        confirmLabel="Enregistrer"
                        cancelLabel="Annuler"
                        onPopupStateChange={setHasButtonsPopupOpen}
                    />
                </div>
            </div>

            {/* Popup spécifique pour la croix */}
            <ConfirmDialog
                open={openCloseConfirm}
                title="Modifications non enregistrées"
                message={
                    <>
                        <p>Vous avez modifié cette fiche enseignant.</p>
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