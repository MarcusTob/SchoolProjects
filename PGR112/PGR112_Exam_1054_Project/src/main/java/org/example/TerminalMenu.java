package org.example;

import java.sql.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class TerminalMenu implements Event {

    //Creating a scanner for the helper method
    private static Scanner input = new Scanner(System.in);
    private Student loggedInStudent;

    public void mainMenu() throws SQLException {
        System.out.println("Welcome! Please choose an option: ");
        System.out.println("1. Log in");
        System.out.println("0. Exit");

        while (true) {
            switch(this.promptUser("Select an option: ")) {
                case "1" -> logIn();
                case "0" -> quitMenu();
                default -> {
                    System.out.println("Please choose a valid option");
                    continue;
                }
            }
            break;
        }
    }

    //Logs in as an active student in University Database
    @Override
    public void logIn() throws SQLException {
        System.out.println("Please log in with your name: ");

        String name = promptUser("Enter your name: ");

        try{
            loggedInStudent = fetchStudent(name);

            loggedInStudent.setCourses((ArrayList<String>) fetchActiveCourses(loggedInStudent.getStudentId()));

        } catch(RuntimeException e) {
            e.printStackTrace();
            System.out.println("This name is not recognised as a active student, redirecting you to the main menu. \n");
            notValidInput();
        }
        subMenu1();
    }

    //Sub menu which is the standard menu after every method
    public void subMenu1() throws SQLException {
        System.out.println("Welcome " + loggedInStudent.getStudentName() + "!" + " Please choose on of the following options: ");
        System.out.println("1. Register for the ceremony");
        System.out.println("2. View a list of everyone registered");
        System.out.println("3. Remove guests from registration");
        System.out.println("4. View the ceremony program");
        System.out.println("0. Exit");

        while(true) {
            switch(this.promptUser("Select an option: ")) {
                case "1" -> registerForEvent();
                case "2" -> viewAllRegistered();
                case "3" -> deleteRegistration(promptUser("Write the name of the person you want to remove from the registration"));
                case "4" -> seeProgram();
                case "0" -> quitMenu();
                default -> {
                    System.out.println("Please choose a valid option");
                    continue;
                }
            }
            break;
        }
    }

    //Shows the planned program for the ceremony
    @Override
    public void seeProgram() throws SQLException {
        System.out.println("Here is the program for the ceremony: ");

        List<Course> courses = fetchAllCourses();

        System.out.println("Start time: 13:00 \n" + "Introduction: 30 Minutes");
        while(courses.size() > 0) {
            Course course = courses.get(courses.size()-1);
            if(loggedInStudent.getCourses().contains(course.getCourseCode())){
                System.out.println(course.getCourseName() + " - 1 minute");
                System.out.println("---You are signed up for this course ---");

            }
            courses.remove(courses.size()-1);
            System.out.println(course.getCourseName() + " - 1 minute");
        }
        System.out.println("Closing remarks - 15 minutes");
        goToMenu();
    }

    //Registers the logged in user for the event, and redirects them to register guests
    @Override
    public void registerForEvent() throws SQLException {
        try (Connection connection = DatabaseEvent.eventDbConnection()){
            String query = "INSERT INTO registered_students(id, name) VALUES (?, ?);";

            PreparedStatement statement = connection.prepareStatement(query);
            statement.setInt(1, loggedInStudent.getStudentId());
            statement.setString(2, loggedInStudent.getStudentName());
            statement.executeUpdate();
            System.out.println("You are now registered for the ceremony!");

        }
        catch(SQLException e){
            System.out.println("You are already registered for this ceremony");

        }
        inviteGuest();
    }

    //Lets the logged in user to remove a registration that they have made
    @Override
    public void deleteRegistration(String name) throws SQLException {
        ArrayList<registeredGuest> guestsInvitedByStudent = (ArrayList<registeredGuest>) fetchAllGuestsInvitedByStudent(loggedInStudent.getStudentId());

        //https://stackoverflow.com/questions/18852059/java-list-containsobject-with-field-value-equal-to-x
        if(!guestsInvitedByStudent.stream().anyMatch(o -> o.getName().equals(name))){
            System.out.println("This guest is not invited by you");
            goToMenu();
        }

        try (Connection connection = DatabaseEvent.eventDbConnection()){
            String query = "DELETE FROM registered_guest WHERE name = ?;";

            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, name);
            statement.executeUpdate();
            System.out.println("You have removed " + name + " from the registration");
        }
        catch(SQLException e){
            System.out.println("Person is not registered");
        }
        goToMenu();
    }

    //Lets the user invite up to 4 guests
    @Override
    public void inviteGuest() throws SQLException {
        System.out.println("How many guests do you wish to invite?");
        ArrayList<registeredGuest> guests = (ArrayList<registeredGuest>) fetchAllGuestsInvitedByStudent(loggedInStudent.getStudentId());
        int chosenAmount = guests.size();

        if(guests.size() == 4) {
            System.out.println("You have reached your limit on guests invited");
            return;
        }
        chosenAmount = Integer.parseInt(promptUser("Amount of guests: "));
            while (chosenAmount > (4 - guests.size())) {
                System.out.println("You have tried to invite too many guests, you can invite " + (4-guests.size()) + " more");
                chosenAmount = Integer.parseInt(promptUser("Amount of guests: "));
            }
        for (int i = 0; i < chosenAmount; i++) {
            insertGuest(promptUser("Please write the name of the guest you wish to invite: "));
        }
        goToMenu();
    }

    //Inserts the given guest into the event database
    public void insertGuest(String name) throws SQLException {
        try (Connection connection = DatabaseEvent.eventDbConnection()){
            String query = "INSERT INTO registered_guest(name, invited_By) VALUES (?, ?);";

            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, name);
            statement.setInt(2, loggedInStudent.getStudentId());
            statement.executeUpdate();
            System.out.println("You have registered: " + name);
        }
        catch(SQLException e){
            System.out.println("Person is already invited to the ceremony");
        }
    }

    //Prints a list of all people registered for the event
    public void viewAllRegistered() throws SQLException {
        fetchAllGuests();
        fetchAllStudents();
        fetchAllTeachers();
        List<Object> allRegisteredPeople = new ArrayList<Object>();
        allRegisteredPeople.addAll(fetchAllStudents());
        allRegisteredPeople.addAll(fetchAllGuests());
        allRegisteredPeople.addAll(fetchAllTeachers());
        for(int i = 0; i < allRegisteredPeople.size(); i++) {
            if (allRegisteredPeople.get(i) instanceof registeredGuest) {
                registeredGuest guest = (registeredGuest) allRegisteredPeople.get(i);
                System.out.println("Guest: " + guest.getName());
            }
            else if(allRegisteredPeople.get(i) instanceof registeredStudent) {
                registeredStudent student = (registeredStudent) allRegisteredPeople.get(i);
                System.out.println("Student: " + student.getName());
            }
            else if(allRegisteredPeople.get(i) instanceof registeredTeacher) {
                registeredTeacher teacher = (registeredTeacher) allRegisteredPeople.get(i);
                System.out.println("Teacher: " + teacher.getName());
            }
        }
        goToMenu();
    }

    //Helper methods
    public void goToMenu() throws SQLException {
        promptUser("\nPress Enter To Continue");
        subMenu1();
    }
    //Fetches a students information
    public Student fetchStudent(String name) {
        try (Connection connection = DatabaseUniversity.uniDbConnection()){
            String query = "SELECT* FROM student WHERE name = ?;";

            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, name);
            ResultSet result = statement.executeQuery();

            if(!result.isBeforeFirst()) {
                throw new Exception("Name not found as an active student");
            }
            result.next();
            Student student = new Student();
            student.setStudentId(result.getInt("id"));
            student.setStudentName(result.getString("name"));
            return student;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //Fetches the students active courses
    public List<String> fetchActiveCourses(int id) {
        try(Connection connection = DatabaseUniversity.uniDbConnection()) {
            String query = "SELECT course_code FROM course_student WHERE Student_id = ?;";

            PreparedStatement statement = connection.prepareStatement(query);
            statement.setInt(1, id);
            ResultSet result = statement.executeQuery();
            ArrayList<String> courseCode = new ArrayList<>();

            if(!result.isBeforeFirst()) {
                throw new Exception("ID not found as an active student");
            }
            while(result.next()) {
                courseCode.add(result.getString("course_code"));
            }
            return courseCode;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //Fetches all courses
    public List<Course> fetchAllCourses() throws SQLException {
        try(Connection connection = DatabaseUniversity.uniDbConnection()) {
            String query = "SELECT * FROM course;";

            PreparedStatement statement = connection.prepareStatement(query);
            ResultSet result = statement.executeQuery();
            ArrayList<Course> courses = new ArrayList<>();
            while(result.next()) {
                Course course = new Course(result.getString("code"),result.getString("name"));
                courses.add(course);
            }
            return courses;
        }
    }

    //Fetches all guests that have been invited by the student based on student id
    public List<registeredGuest> fetchAllGuestsInvitedByStudent(int id) throws SQLException {
        try(Connection connection = DatabaseEvent.eventDbConnection()) {

            String query = "SELECT * FROM registered_guest WHERE invited_By = ?;";

            PreparedStatement statement = connection.prepareStatement(query);
            statement.setInt(1, id);
            ResultSet result = statement.executeQuery();
            ArrayList<registeredGuest> guests = new ArrayList<>();

            while(result.next()) {
                registeredGuest guest = new registeredGuest(result.getInt("id"),
                        result.getString("name"),
                        result.getInt("invited_By"));
                guests.add(guest);
            }
            return guests;
        }
    }

    //Fetches all the guests registered for the event
    public ArrayList<registeredGuest> fetchAllGuests() {
        try(Connection connection = DatabaseEvent.eventDbConnection()) {

            String query = "SELECT * FROM registered_guest;";

            PreparedStatement statement = connection.prepareStatement(query);
            ResultSet result = statement.executeQuery();
            ArrayList<registeredGuest> guests = new ArrayList<>();

            while(result.next()) {
                registeredGuest guest = new registeredGuest(result.getInt("id"),
                        result.getString("name"),
                        result.getInt("invited_By"));
                guests.add(guest);
            }
            return guests;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    //Fetches all the students registered for the event
    public ArrayList<registeredStudent> fetchAllStudents() {
        try(Connection connection = DatabaseEvent.eventDbConnection()) {

            String query = "SELECT * FROM registered_students;";

            PreparedStatement statement = connection.prepareStatement(query);
            ResultSet result = statement.executeQuery();
            ArrayList<registeredStudent> students = new ArrayList<>();

            while(result.next()) {
                registeredStudent student = new registeredStudent(result.getInt("id"), result.getString("name"));
                students.add(student);
            }
            return students;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    //Fetches all the teachers, which are invited by default
    public ArrayList<registeredTeacher> fetchAllTeachers() throws SQLException {
        try(Connection connection = DatabaseUniversity.uniDbConnection()) {
            String query = "SELECT * FROM teacher;";

            PreparedStatement statement = connection.prepareStatement(query);
            ResultSet result = statement.executeQuery();
            ArrayList<registeredTeacher> teachers = new ArrayList<>();

            while (result.next()) {
                registeredTeacher teacher = new registeredTeacher(result.getInt("id"), result.getString("name"));
                teachers.add(teacher);
            }
            return teachers;
        }
    }

    // Makes a Scanner to recieve the input
    private String getInput() {
        return input.nextLine();
    }
    //Creates a prompt, and uses the method above to recieve input
    String promptUser(String prompt) {
        System.out.println(prompt);
        return getInput();
    }
    //Stops the program and quits
    private void quitMenu() {
        System.out.println("Goodbye!");
        System.exit(1);
    }
    //If user inputs something that is not valid, returns them to the main menu
    private void notValidInput() throws SQLException {
        this.mainMenu();
    }
}
