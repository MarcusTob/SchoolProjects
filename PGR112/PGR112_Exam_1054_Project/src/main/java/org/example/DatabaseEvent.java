package org.example;

import com.mysql.cj.jdbc.Driver;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseEvent {
    static {
        try {
            DriverManager.registerDriver(new Driver());
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
    static Connection eventDbConnection() {
        try {
            return DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/eventDb",
                    "eventroot",
                    "eventroot"
            );
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

}
