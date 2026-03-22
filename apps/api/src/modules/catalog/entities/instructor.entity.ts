import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CourseEntity } from "./course.entity";

@Entity("instructors")
export class InstructorEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "full_name", length: 120 })
  fullName!: string;

  @Column({ length: 140 })
  title!: string;

  @Column({ type: "text", nullable: true })
  bio!: string | null;

  @Column({ name: "avatar_url", type: "varchar", nullable: true })
  avatarUrl!: string | null;

  @Column({ name: "years_of_experience", default: 0 })
  yearsOfExperience!: number;

  @OneToMany(() => CourseEntity, (course) => course.instructor)
  courses!: CourseEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
