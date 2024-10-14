package org.example;

public class registeredGuest {
    private int id;
    private String name;
    private int invited_By;


    public registeredGuest(int id, String name, int invited_By) {
        this.id = id;
        this.name = name;
        this.invited_By = invited_By;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getInvited_By() {
        return invited_By;
    }

    public void setInvited_By(int invited_By) {
        this.invited_By = invited_By;
    }
}
