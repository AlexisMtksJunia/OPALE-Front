// src/components/common/ActionButtonsWithConfirm.tsx
import React, { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

interface ActionButtonsWithConfirmProps {
    saveLabel?: string
    cancelLabel?: string

    confirmTitle?: string
    confirmMessage?: React.ReactNode
    confirmLabel?: string

    hasChanges?: boolean
    cancelDirtyTitle?: string
    cancelDirtyMessage?: React.ReactNode
    cancelDirtyConfirmLabel?: string
    cancelDirtyDiscardLabel?: string

    onSave: () => void
    onCancel: () => void

    // désactiver totalement le bouton principal (optionnel)
    saveDisabled?: boolean

    // callback après confirmation "OK" (ex: fermer la card)
    onAfterSaveConfirm?: () => void

    // ✅ nouveau : hook avant ouverture de la pop-up principale
    // si ça retourne false -> on n’ouvre pas la modale
    onBeforeSaveClick?: () => boolean | void
}

const ActionButtonsWithConfirm: React.FC<ActionButtonsWithConfirmProps> = ({
                                                                               saveLabel = 'Enregistrer',
                                                                               cancelLabel = 'Annuler',
                                                                               confirmTitle = 'Confirmer les modifications',
                                                                               confirmMessage = 'Souhaitez-vous enregistrer les modifications ?',
                                                                               confirmLabel = 'Confirmer',
                                                                               hasChanges = false,
                                                                               cancelDirtyTitle = 'Modifications non enregistrées',
                                                                               cancelDirtyMessage = (
                                                                                   <>
                                                                                       <p>Vous avez modifié certaines informations.</p>
                                                                                       <p>Souhaitez-vous les enregistrer avant de quitter&nbsp;?</p>
                                                                                   </>
                                                                               ),
                                                                               cancelDirtyConfirmLabel = 'Enregistrer et fermer',
                                                                               cancelDirtyDiscardLabel = 'Fermer sans enregistrer',
                                                                               onSave,
                                                                               onCancel,
                                                                               saveDisabled = false,
                                                                               onAfterSaveConfirm,
                                                                               onBeforeSaveClick,
                                                                           }) => {
    const [openSaveConfirm, setOpenSaveConfirm] = useState(false)
    const [openCancelConfirm, setOpenCancelConfirm] = useState(false)

    /* -------- Bouton principal ("Enregistrer" / "Créer") -------- */
    const openSaveConfirmDialog = () => {
        if (saveDisabled) return

        if (onBeforeSaveClick) {
            const ok = onBeforeSaveClick()
            if (ok === false) {
                // validation négative → on n’ouvre PAS la modale
                return
            }
        }

        setOpenSaveConfirm(true)
    }

    const closeSaveConfirmDialog = () => {
        setOpenSaveConfirm(false)
    }

    const handleConfirmSave = () => {
        closeSaveConfirmDialog()
        onSave()
        if (onAfterSaveConfirm) {
            onAfterSaveConfirm()
        }
    }

    /* -------- Bouton "Annuler" -------- */
    const handleCancelClick = () => {
        if (!hasChanges) {
            onCancel()
            return
        }
        setOpenCancelConfirm(true)
    }

    const closeCancelConfirmDialog = () => {
        setOpenCancelConfirm(false)
    }

    const handleConfirmCancelWithSave = () => {
        closeCancelConfirmDialog()
        onSave()
        onCancel()
    }

    const handleDiscardChangesAndClose = () => {
        closeCancelConfirmDialog()
        onCancel()
    }

    return (
        <>
            <div className="action-buttons-row">
                <button
                    type="button"
                    className="btn-tertiary"
                    onClick={handleCancelClick}
                >
                    {cancelLabel}
                </button>

                <button
                    type="button"
                    className="btn-primary"
                    onClick={openSaveConfirmDialog}
                    disabled={saveDisabled}
                >
                    {saveLabel}
                </button>
            </div>

            <ConfirmDialog
                open={openSaveConfirm}
                title={confirmTitle}
                message={confirmMessage}
                confirmLabel={confirmLabel}
                cancelLabel={cancelLabel}
                onConfirm={handleConfirmSave}
                onCancel={closeSaveConfirmDialog}
                onRequestClose={closeSaveConfirmDialog}
            />

            <ConfirmDialog
                open={openCancelConfirm}
                title={cancelDirtyTitle}
                message={cancelDirtyMessage}
                confirmLabel={cancelDirtyConfirmLabel}
                cancelLabel={cancelDirtyDiscardLabel}
                confirmClassName="btn-primary"
                cancelClassName="btn-danger"
                onConfirm={handleConfirmCancelWithSave}
                onCancel={handleDiscardChangesAndClose}
                onRequestClose={closeCancelConfirmDialog}
            />
        </>
    )
}

export default ActionButtonsWithConfirm