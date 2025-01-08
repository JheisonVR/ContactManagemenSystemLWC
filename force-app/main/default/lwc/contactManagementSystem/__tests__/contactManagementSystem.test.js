import { createElement } from 'lwc';
import ContactManagementSystem from 'c/contactManagementSystem';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getContacts from '@salesforce/apex/ContacsController.getContacts';
import createContact from '@salesforce/apex/ContacsController.createContact';
import updateContacts from '@salesforce/apex/ContacsController.updateContacts';
import deleteContact from '@salesforce/apex/ContacsController.deleteContact';

const mockGetContacts = require('./data/getContacts.json');

const getContactsAdapter = registerApexTestWireAdapter(getContacts);

jest.mock('@salesforce/apex/ContacsController.createContact', () => {
    return {
        default: jest.fn()
    };
});

jest.mock('@salesforce/apex/ContacsController.updateContacts', () => {
    return {
        default: jest.fn()
    };
});

jest.mock('@salesforce/apex/ContacsController.deleteContact', () => {
    return {
        default: jest.fn()
    };
});

describe('c-contact-management-system', () => {
    afterEach(() => {

        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        jest.clearAllMocks();
    });

    it('renders contact data', () => {
        const element = createElement('c-contact-management-system', {
            is: ContactManagementSystem
        });
        document.body.appendChild(element);

        getContactsAdapter.emit(mockGetContacts);

        return Promise.resolve().then(() => {
            const table = element.shadowRoot.querySelector('lightning-datatable');
            expect(table.data).toEqual(mockGetContacts);
        });
    });

    it('handles create contact', () => {
        const element = createElement('c-contact-management-system', {
            is: ContactManagementSystem
        });
        document.body.appendChild(element);

        createContact.mockResolvedValue('Success: Contact created successfully');

        const firstNameInput = element.shadowRoot.querySelector('lightning-input[data-id="firstName"]');
        firstNameInput.value = 'New';
        firstNameInput.dispatchEvent(new CustomEvent('change'));

        const lastNameInput = element.shadowRoot.querySelector('lightning-input[data-id="lastName"]');
        lastNameInput.value = 'Contact';
        lastNameInput.dispatchEvent(new CustomEvent('change'));

        const emailInput = element.shadowRoot.querySelector('lightning-input[data-id="email"]');
        emailInput.value = 'newcontact@example.com';
        emailInput.dispatchEvent(new CustomEvent('change'));

        const phoneInput = element.shadowRoot.querySelector('lightning-input[data-id="phone"]');
        phoneInput.value = '0987654321';
        phoneInput.dispatchEvent(new CustomEvent('change'));

        const createButton = element.shadowRoot.querySelector('lightning-button[data-id="createButton"]');
        createButton.click();

        return Promise.resolve().then(() => {
            expect(createContact).toHaveBeenCalled();
            expect(createContact).toHaveBeenCalledWith({
                contactData: {
                    FirstName: 'New',
                    LastName: 'Contact',
                    Email: 'newcontact@example.com',
                    Phone: '0987654321'
                }
            });
        });
    });

    it('handles update contacts', () => {
        const element = createElement('c-contact-management-system', {
            is: ContactManagementSystem
        });
        document.body.appendChild(element);

        updateContacts.mockResolvedValue('Success: Contacts updated successfully');

        getContactsAdapter.emit(mockGetContacts);

        return Promise.resolve().then(() => {
            const table = element.shadowRoot.querySelector('lightning-datatable');
            const rows = [...table.data]; 
            rows[0].FirstName = 'UpdatedFirstName';
            rows[0].LastName = 'UpdatedLastName';
            rows[0].Email = 'updatedemail@example.com';
            rows[0].Phone = '111-222-3333';

            table.data = rows;

            // Simulate form submission for updating contacts
            const updateButton = element.shadowRoot.querySelector('lightning-button[data-id="updateButton"]');
            updateButton.click();

            return Promise.resolve().then(() => {
                expect(updateContacts).toHaveBeenCalled();
                expect(updateContacts).toHaveBeenCalledWith(rows);
            });
        });
    });

    it('handles delete contact', () => {
        const element = createElement('c-contact-management-system', {
            is: ContactManagementSystem
        });
        document.body.appendChild(element);

        deleteContact.mockResolvedValue('Success: Contact deleted successfully');


        getContactsAdapter.emit(mockGetContacts);

        return Promise.resolve().then(() => {

            const table = element.shadowRoot.querySelector('lightning-datatable');
            const deleteButton = table.shadowRoot.querySelector('button[data-id="deleteButton"]');
            deleteButton.click();

            return Promise.resolve().then(() => {
                expect(deleteContact).toHaveBeenCalled();
                expect(deleteContact).toHaveBeenCalledWith({ contactId: mockGetContacts[0].Id });
            });
        });
    });
});