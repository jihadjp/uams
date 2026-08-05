package com.metamorph_x.uams.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "grading_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradingPolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "min_marks", nullable = false, precision = 5, scale = 2)
    private BigDecimal minMarks;

    @Column(name = "max_marks", nullable = false, precision = 5, scale = 2)
    private BigDecimal maxMarks;

    @Column(nullable = false, length = 5)
    private String grade;

    @Column(name = "grade_point", nullable = false, precision = 3, scale = 2)
    private BigDecimal gradePoint;

    @Column(length = 50)
    private String remarks;
}
