package faculte.service_interne.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;


/**
 * Représente le profil métier d'un utilisateur interne.
 * Cette entité est distincte du User de sécurité (authentification).
 * Elle contient uniquement les informations professionnelles et personnelles
 * nécessaires au fonctionnement interne du système.
 */
@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    /**
     * Identifiant de l'utilisateur.
     * Correspond exactement à l'ID du User dans le microservice Security.
     * Il n'y a pas de duplication des utilisateurs.
     */
    @Id
    private Integer userId;

    // =========================
    // INFORMATIONS PERSONNELLES
    // =========================

    /** Nom de l'utilisateur */
    @Column(nullable = false)
    private String nom;

    /** Prénom de l'utilisateur */
    @Column(nullable = false)
    private String prenom;

    /** Numéro de téléphone (optionnel, mais utile pour le contact) */
    private String telephone;
    private String email;

    /** Adresse de résidence de l'utilisateur */
    private String adresse;

    /** Numéro de carte d'identité (utile pour la vérification) */
    private String cin;

    // =========================
    // INFORMATIONS METIER
    // =========================

    /**
     * Rôle métier de l'utilisateur dans l'organisation.
     * Exemple : RECEPTIONNISTE, HOUSEKEEPING, MAINTENANCE, MANAGER.
     * Ce rôle n'a aucun lien avec les rôles de sécurité.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false,length = 50)
    private MetierRole metierRole = MetierRole.DEFOULT;;

    /** Département ou service de l'utilisateur */
   // @Column(nullable = false)
    private String departement;

    /** Date d'embauche de l'utilisateur */
    private LocalDate dateEmbauche;

    /**
     * Identifiant du superviseur direct.
     * Référence vers le userId du responsable hiérarchique.
     */
    private Integer superviseurId;

    /**
     * Indique si l'utilisateur est actuellement disponible
     * pour effectuer des tâches (maintenance, ménage, etc.).
     */
    private Boolean disponible = true;

    // VALIDATION DU PROFIL
    /**
     * Statut du profil.
     * DRAFT : profil incomplet
     * PENDING : en attente de validation par un administrateur
     * VALIDATED : profil validé
     * REJECTED : profil refusé
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false,length = 50)
    private ProfileStatus status = ProfileStatus.DRAFT;;

    /** Raison du refus du profil (si statut = REJECTED) */
    private String rejectionReason;
    /** Date de création du profil */
    private LocalDateTime createdAt;
    /** Date de la dernière mise à jour */
    private LocalDateTime updatedAt;
    /** Date de validation du profil */
    private LocalDateTime validatedAt;
    /**
     * Identifiant de l'administrateur ayant validé le profil.
     * Correspond au userId du Security Service.
     */
    private Integer validatedBy;
}


