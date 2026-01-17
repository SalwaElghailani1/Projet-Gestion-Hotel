package faculte.service_interne.entities;

/**
 * Représente l'état du profil utilisateur.
 * Permet de contrôler l'accès au système
 * et de garantir la fiabilité des données.
 */
public enum ProfileStatus {

    /** Profil en cours de saisie par l'utilisateur */
    DRAFT,

    /** Profil soumis et en attente de validation */
    PENDING,

    /** Profil validé par un administrateur */
    VALIDATED,

    /** Profil refusé par un administrateur */
    REJECTED,

    /** Utilisateur connecté et actif */
    ON_WORK,

    /** Utilisateur déconnecté */
    OUT_WORK
}