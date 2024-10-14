package org.example;

import java.sql.SQLException;

public interface Event {

    void logIn() throws SQLException;

    void seeProgram() throws SQLException;

    void registerForEvent() throws SQLException;

    void deleteRegistration(String name) throws SQLException;

    void inviteGuest() throws SQLException;

    void viewAllRegistered() throws SQLException;
}
