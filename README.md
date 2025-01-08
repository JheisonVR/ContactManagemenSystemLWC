# Contact Management System Salesforce LWC

## Overview

The Contact Management System is a Lightning Web Component (LWC) that provides a comprehensive solution for managing contacts within a Salesforce organization. It allows users to search, create, update, and delete contacts through an intuitive user interface.

## Features

- **Search Contacts**: Retrieve a list of contacts using keywords.
- **Create Contact**: Add new contacts with validation to ensure required fields like Email are filled in.
- **Update Contacts**: Edit contact information directly within the data table.
- **Delete Contact**: Remove individual contacts.
- **Delete Bulk Contacts**: Delete multiple contacts in bulk.

## Setup Instructions

### Prerequisites

- Salesforce DX CLI
- Node.js (with npm)
- A Salesforce Developer Org

### Steps to Set Up

1. **Clone the Repository**

    ```bash
    git clone https://github.com/JheisonVR/ContactManagemenSystemLWC.git
    cd ContactsWebComponent
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Authorize a Salesforce Org**

    ```bash
    sfdx force:auth:web:login -a <alias>
    ```

4. **Deploy to Salesforce Org**

    ```bash
    sfdx force:source:deploy -p force-app
    ```

5. **Assign the Permission Set**

    ```bash
    sfdx force:user:permset:assign -n Contact_Management
    ```

6. **Import Sample Data**

    ```bash
    sfdx force:data:tree:import -p data/sample-data-plan.json
    ```

7. **Open the Org**

    ```bash
    sfdx force:org:open
    ```

## Usage

### Accessing the Component

Navigate to the App Launcher in your Salesforce org and search for "Contact Management". Open the app to access the Contact Management System component.

### Functionalities

- **Search**: Use the search bar to find contacts by keywords.
- **Create**: Click the "New Contact" button to open the contact creation modal. Fill in the required fields and save.
- **Update**: Edit contact details directly in the data table and save changes.
- **Delete**: Use the delete button next to each contact to remove it. For bulk deletion, select multiple contacts and click the "Delete Selected" button.

## SOLID Principles

The classes within the LWC have been refactored and renamed to adhere to the SOLID principles for improved code maintainability and flexibility:

- **Single Responsibility Principle**: Each class has a single responsibility.
- **Open/Closed Principle**: Classes are open for extension but closed for modification.
- **Liskov Substitution Principle**: Subtypes can replace their base types without altering the correctness of the program.
- **Interface Segregation Principle**: No client should be forced to depend on methods it does not use.
- **Dependency Inversion Principle**: High-level modules should not depend on low-level modules. Both should depend on abstractions.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any questions or support, please contact [J.sonva@gmail.com](mailto:J.sonva@gmail.com).

---

**Note**: Please ensure that any sensitive information such as access credentials is not included in public documentation. Provide instructions on how to obtain them securely if necessary.
