import { api, LightningElement,  track,  wire } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {refreshApex} from "@salesforce/apex"
import getContacts from '@salesforce/apex/ContacsController.getContacts';
import createContact from '@salesforce/apex/ContacsController.createContact';
import updateContacts from '@salesforce/apex/ContacsController.updateContacts';
import deleteContact from '@salesforce/apex/ContacsController.deleteContact';
import deleteBulkContacts from '@salesforce/apex/ContacsController.deleteBulkContacts';

import { getRecordNotifyChange} from 'lightning/uiRecordApi';

const actions = [
    {label: 'Delete', name: 'delete'}
]

const columns = [
    {label: 'First Name', fieldName: 'FirstName', editable:true},
    {label: 'Last Name', fieldName: 'LastName', editable:true},
    {label: 'Email', fieldName: 'Email', type:'email', editable:true},
    {label: 'Phone', fieldName: 'Phone', type:'Phone', editable:true},
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions,
            menuAlignment: 'right'
        }
    }
]

export default class ContactManagementSystem extends LightningElement {
    @api recordId;
    columns = columns;
    @track keyWord='';
    modalOpen= false;
    draftValues = [];

    rowsSelected=[];

    @track newContact = {
        FirstName: '',
        LastName: '',
        Email: '',
        Phone: ''
    }

    handleInputChange(event){
        const {name} = event.target;
        this.newContact[name] = event.target.value;
    }

    @wire(getContacts, {keyWord: '$keyWord'})
    contact;

    handleInputSearchChange(event){
        this.keyWord = event.target.value;
    }

    handleClearInput() {
        this.keyWord = '';
        const inputField = this.template.querySelector('lightning-input');
        if (inputField) {
            inputField.value = '';
        }
    }

    handleOpenModal(){
        this.modalOpen = true;
    }
    
    handleCloseModal(){
        this.modalOpen = false;
        this.newContact = {
            FirstName: '',
            LastName: '',
            Email: '',
            Phone: ''
        };
    }
    
    handleSubmitForm() {
        createContact( { contactData:this.newContact } )
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact successfully created',
                        variant: 'success'
                    })
                );
                this.modalOpen = false;
                refreshApex(this.contact).then(()=>{
                    this.newContact = {
                        FirstName: '',
                        LastName: '',
                        Email: '',
                        Phone: ''
                    };
                });
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'The following error has occurred: ' + (error.body ? error.body.message : error.message),
                        variant: 'error'
                    })
                );
            });
    }


    async handleUpdateContacts(event){
        const updatedFields = event.detail.draftValues;
        const notifyChangeIds = updatedFields.map((row)=>{
            return {recordId: row.Id};
        });
        try{
            const result = await updateContacts({data: updatedFields});
            console.log(JSON.stringify("apex update result: "+ result));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Success",
                    message: "Contact updated",
                    variant: "success"
                })
            );
            getRecordNotifyChange(notifyChangeIds);
            refreshApex(this.contact).then(()=>{
                this.draftValues = [];
            });
        }catch(error){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error",
                    message: error.body.message,
                    variant: "error"
                }))
        }
    }

    async handleRowAction(){
        const row = event.detail.row;

        if(event.detail.action.name === 'delete'){
            this.deleteRecord(row.Id)
        }
    }

    deleteRecord(recordId){     
        deleteContact({contactId: recordId})
        .then(()=> {
            this.dispatchEvent(
                new ShowToastEvent({
                    title:'Success',
                    message: 'Contact successfully deleted',
                    variant: 'success'
                })
            );

            refreshApex(this.contact);
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title:'Error',
                    message: error.body.message,
                    variant:'error'
                })
            )
        })
    }

    mapSelectedRows(){
        const selectedRows = event.detail.selectedRows 
        this.rowsSelected = selectedRows;
    }

    handleBulkDeleteContacts(){
        if(this.rowsSelected.length === 0) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'No Records Selected',
                    message: 'Please select at least one record to proceed.',
                    variant: 'warning'
                })
            );
            return;
        }
        const contactMapIds = this.rowsSelected.map(row => row.Id)

            deleteBulkContacts({contactListIds:contactMapIds})
                .then(()=>{
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title:'success',
                            message:'Contacts successfully deleted',
                            variant: 'success'
                        })
                    )
                    refreshApex(this.contact);

                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title:"Error",
                            message: error.body.message,
                            variant: "error"
                        })
                    )
                })             
    }

}