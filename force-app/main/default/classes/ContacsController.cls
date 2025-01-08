public with sharing class ContacsController {    
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String keyWord) {

        if(String.isNotBlank(keyWord)){
            String searchTerm = '%' + keyWord + '%';
            return [
                SELECT FirstName, LastName, Email, Phone 
                FROM Contact
                WHERE Name LIKE :searchTerm
                LIMIT 20
            ]; 

        }else{            
            return [
                SELECT FirstName, LastName, Email, Phone 
                FROM Contact
                LIMIT 50
            ]; 
        }
    }

    @AuraEnabled
    public static String createContact(Map<String, Object> contactData) {
        String jsonString = JSON.serialize(contactData);
        Contact contactToInsert = (Contact) JSON.deserialize(jsonString, Contact.class);

        if (String.isBlank(contactToInsert.Email)) {
            throw new AuraHandledException('Email is required');
        }

        try {
            insert contactToInsert;
            return 'Success: Contact created successfully';
        } catch (Exception e) {
            throw new AuraHandledException('Error creating contact: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static string updateContacts(Object data){
        List<Contact> contactsForUpdate = (List<Contact>) JSON.deserialize(
            JSON.serialize(data),
            List<Contact>.class 
        );
        for (Contact contact : contactsForUpdate) {
            if (String.isBlank(contact.Email)) {
                throw new AuraHandledException('The Email field is required for all contacts.');
            }
        }
        try {
            update contactsForUpdate;
            return 'Success: Contacts updated successfully';
        } catch (Exception e) {
            return 'The following exception has occurred ' + e.getMessage();
        }
    }

    @AuraEnabled
    public static void deleteContact(String contactId) {
        List<Contact> contacts = [SELECT Id FROM Contact WHERE Id = :contactId];
        if (contacts.isEmpty()) {
            throw new AuraHandledException('Error deleting contact: No contact found with the provided Id.' + contactId);
        }
        delete contacts;
    }
    
    @AuraEnabled
    public static void deleteBulkContacts(List<Id> contactListIds){
        if(contactListIds.isEmpty()){
            throw new AuraHandledException('Error deleting bulk contacts: No contact selected for deletion.');
        }
        try {
             List<Contact> contactsToDelete = [SELECT Id FROM Contact WHERE Id IN :contactListIds];
             delete contactsToDelete;
        } catch (Exception e) {
            throw new AuraHandledException('Error deleting contact: ' + e.getMessage());
        }
    }
}