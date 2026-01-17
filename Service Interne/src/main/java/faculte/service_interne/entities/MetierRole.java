package faculte.service_interne.entities;
/**
 * Définit les rôles métiers des utilisateurs internes.
 * Ces rôles décrivent la fonction réelle de l'utilisateur
 * dans l'organisation, indépendamment des rôles de sécurité.
 */
public enum MetierRole {
    RECEPTIONNISTE,
    HOUSEKEEPING,
    MAINTENANCE,
    COMPTABLE,
    MANAGER,
    ADMIN_INTERNE,
    DEFOULT
}