import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../models/contact';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-update-contact',
  templateUrl: './update-contact.page.html',
  styleUrls: ['./update-contact.page.scss'],
})
export class UpdateContactPage implements OnInit {
  public contact: Contact;
  updateContactForm: FormGroup;
  formIsEdited: boolean = false;

  @ViewChild('updateForm', { static: false }) updateForm: FormGroupDirective;

  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.contact = this.dataService.getContactById(parseInt(id, 10));

    // if the contact doesn't exists, return to home
    if(!this.contact) {
      this.router.navigate(['/home']);
    }

    this.updateContactForm = new FormGroup({
      'firstName': new FormControl(this.contact.firstName, Validators.required),
      'lastName': new FormControl(this.contact.lastName, Validators.required),
      'email': new FormControl(this.contact.email),
      'phone': new FormControl(this.contact.phone, Validators.required),
      'category': new FormControl(this.contact.category, Validators.required)
    });

    this.updateContactForm.valueChanges.subscribe(values => {
      this.formIsEdited = true;
    })
  }

  submitForm() {
    this.updateForm.onSubmit(undefined);
  }

  updateContact(values: any) {
    // copy all the form values into the contact to be updated
    let updatedContact: Contact = { id: this.contact.id, ...values };
    this.dataService.updateContact(updatedContact);
  }

}
