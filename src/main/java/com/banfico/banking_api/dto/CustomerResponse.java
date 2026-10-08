package com.banfico.banking_api.dto;

public class CustomerResponse {

    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private String customerNumber;
    private String status;

    public CustomerResponse() {
    }

    public CustomerResponse(
            Long id,
            String name,
            String email,
            String phoneNumber,
            String address) {
        this(id, name, email, phoneNumber, address, null, null);
    }

    public CustomerResponse(
            Long id,
            String name,
            String email,
            String phoneNumber,
            String address,
            String customerNumber,
            String status) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.customerNumber = customerNumber;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCustomerNumber() {
        return customerNumber;
    }

    public void setCustomerNumber(String customerNumber) {
        this.customerNumber = customerNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}