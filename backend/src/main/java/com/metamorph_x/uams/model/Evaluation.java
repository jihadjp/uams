package com.metamorph_x.uams.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "evaluations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "offering_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", length = 36)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "offering_id", nullable = false)
    private CourseOffering offering;

    @Column(nullable = false)
    private Integer q1;
    @Column(nullable = false)
    private Integer q2;
    @Column(nullable = false)
    private Integer q3;
    @Column(nullable = false)
    private Integer q4;
    @Column(nullable = false)
    private Integer q5;
    @Column(nullable = false)
    private Integer q6;
    @Column(nullable = false)
    private Integer q7;
    @Column(nullable = false)
    private Integer q8;
    @Column(nullable = false)
    private Integer q9;
    @Column(nullable = false)
    private Integer q10;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
