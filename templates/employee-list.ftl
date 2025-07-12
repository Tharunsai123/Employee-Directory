<#-- Employee List Freemarker Template -->
<#-- This template can be used for server-side rendering if needed -->

<#assign employees = [
    {"id": 1, "firstName": "Alice", "lastName": "Smith", "email": "alice@example.com", "department": "HR", "role": "Manager"},
    {"id": 2, "firstName": "Bob", "lastName": "Johnson", "email": "bob@example.com", "department": "IT", "role": "Developer"},
    {"id": 3, "firstName": "Charlie", "lastName": "Lee", "email": "charlie@example.com", "department": "Finance", "role": "Analyst"}
]>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Directory - Freemarker Template</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="employee-grid">
        <#list employees as employee>
            <div class="employee-card" data-id="${employee.id}">
                <h3 class="employee-name">${employee.firstName} ${employee.lastName}</h3>
                <div class="employee-info"><strong>Email:</strong> ${employee.email}</div>
                <div class="employee-info"><strong>Department:</strong> ${employee.department}</div>
                <div class="employee-info"><strong>Role:</strong> ${employee.role}</div>
                <div class="card-actions">
                    <button class="btn btn-primary btn-sm" onclick="editEmployee(${employee.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${employee.id})">Delete</button>
                </div>
            </div>
        </#list>
    </div>
    
    <#-- Pagination example -->
    <#assign currentPage = 1>
    <#assign totalPages = 5>
    
    <div class="pagination">
        <#if currentPage gt 1>
            <button onclick="changePage(${currentPage - 1})">Previous</button>
        <#else>
            <button disabled>Previous</button>
        </#if>
        
        <#list 1..totalPages as page>
            <#if page == currentPage>
                <button class="active">${page}</button>
            <#else>
                <button onclick="changePage(${page})">${page}</button>
            </#if>
        </#list>
        
        <#if currentPage lt totalPages>
            <button onclick="changePage(${currentPage + 1})">Next</button>
        <#else>
            <button disabled>Next</button>
        </#if>
        
        <span class="pagination-info">Page ${currentPage} of ${totalPages}</span>
    </div>
</body>
</html>