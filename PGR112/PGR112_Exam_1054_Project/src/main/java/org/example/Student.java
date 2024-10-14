package org.example;

import java.util.ArrayList;

public class Student{
    private int studentId;
    private String studentName;
    private ArrayList<String> courses = new ArrayList<>();

    Student() {

    }

    public Student(int studentId, String studentName, ArrayList<String> courses) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.courses = courses;
    }

    public int getStudentId() {
        return studentId;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String name) {
        this.studentName = name;
    }

    public ArrayList<String> getCourses() {
        return courses;
    }

    public void setCourses(ArrayList<String> courses) {
        this.courses = courses;
    }
}
