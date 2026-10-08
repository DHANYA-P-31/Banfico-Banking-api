package com.banfico.banking_api.service;

import com.banfico.banking_api.dto.BeneficiaryRequest;
import com.banfico.banking_api.dto.BeneficiaryResponse;
import com.banfico.banking_api.entity.Beneficiary;
import com.banfico.banking_api.entity.Customer;
import com.banfico.banking_api.exception.ResourceNotFoundException;
import com.banfico.banking_api.repository.BeneficiaryRepository;
import com.banfico.banking_api.repository.CustomerRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BeneficiaryServiceImpl
        implements BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final CustomerRepository customerRepository;
    private final AuditService auditService;

    public BeneficiaryServiceImpl(
            BeneficiaryRepository beneficiaryRepository,
            CustomerRepository customerRepository,
            AuditService auditService) {

        this.beneficiaryRepository = beneficiaryRepository;
        this.customerRepository = customerRepository;
        this.auditService = auditService;
    }

    @Override
    public BeneficiaryResponse createBeneficiary(
            BeneficiaryRequest request) {

        if (request.getCustomerId() == null) {
            throw new IllegalArgumentException("Customer ID is required");
        }

        Customer customer = customerRepository
                .findById(request.getCustomerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id: "
                                        + request.getCustomerId()
                        ));

        Beneficiary beneficiary = new Beneficiary();

        beneficiary.setName(request.getName());
        beneficiary.setAccountNumber(
                request.getAccountNumber()
        );
        beneficiary.setBankName(request.getBankName());
        beneficiary.setIfscCode(request.getIfscCode());
        beneficiary.setCustomer(customer);

        Beneficiary savedBeneficiary =
                beneficiaryRepository.save(beneficiary);
        auditService.record("BENEFICIARY_CREATED", customer.getId(), "BENEFICIARY", savedBeneficiary.getId());

        return mapToResponse(savedBeneficiary);
    }

    @Override
    public List<BeneficiaryResponse>
    getAllBeneficiaries() {

        return beneficiaryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void deleteBeneficiary(Long id) {

        if (!beneficiaryRepository.existsById(id)) {

            throw new ResourceNotFoundException(
                    "Beneficiary not found with id: " + id
            );
        }

        Beneficiary beneficiary = beneficiaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found with id: " + id));
        beneficiaryRepository.delete(beneficiary);
        auditService.record("BENEFICIARY_DELETED", beneficiary.getCustomer().getId(), "BENEFICIARY", id);
    }

    private BeneficiaryResponse mapToResponse(
            Beneficiary beneficiary) {

        return new BeneficiaryResponse(
                beneficiary.getId(),
                beneficiary.getName(),
                beneficiary.getAccountNumber(),
                beneficiary.getBankName(),
                beneficiary.getIfscCode(),
                beneficiary.getCustomer().getId(),
                beneficiary.getCustomer().getCustomerNumber()
        );
    }
}