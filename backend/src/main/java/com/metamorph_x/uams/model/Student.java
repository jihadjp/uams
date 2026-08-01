package com.metamorph_x.uams.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import com.metamorph_x.uams.model.enums.StudentStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @ManyToOne
    @JoinColumn(name = "advisor_id")
    private Faculty advisor;

    @Column(name = "student_id", unique = true, nullable = false, length = 30)
    private String studentId;

    @Column(name = "registration_no", unique = true, nullable = false, length = 30)
    private String registrationNo;

    @ManyToOne
    @JoinColumn(name = "batch_id")
    @org.hibernate.annotations.NotFound(action = org.hibernate.annotations.NotFoundAction.IGNORE)
    private Batch batch;

    @Column(name = "current_semester", nullable = false)
    @Builder.Default
    private Integer currentSemester = 1;

    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal cgpa = BigDecimal.ZERO;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "guardian_id")
    private Guardian guardian;

    @Column(name = "is_registration_cleared", nullable = false)
    @Builder.Default
    private boolean isRegistrationCleared = false;

    @Column(name = "has_received_laptop", nullable = false)
    @Builder.Default
    private boolean hasReceivedLaptop = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private StudentStatus status = StudentStatus.ACTIVE;

    @Column(name = "admitted_at", nullable = false)
    private LocalDate admittedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
