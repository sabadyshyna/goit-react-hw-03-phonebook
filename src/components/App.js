import React from 'react';

import ContactForm from './ContactForm';
import ContactList from './ContactList';
import Filter from './Filter';
import Container from './Container';

import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const nextContacts = this.state.contacts;
    const prevContacts = prevState.contacts;

    if (nextContacts !== prevContacts) {
      localStorage.setItem('contacts', JSON.stringify(nextContacts));
    }
  }

  addContact = ({ name, number }) => {
    const contact = {
      id: uuidv4(),
      name,
      number,
    };

    const isNumberInContacts = this.state.contacts.some(
      contact => contact.number === number,
    );

    if (
      this.state.contacts.some(
        contact => contact.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      alert(`${name} is already in contacts`);
    } else if (isNumberInContacts) {
      alert(`${number} is already in contacts`);
    } else {
      this.setState(({ contacts }) => ({
        contacts: [contact, ...contacts],
      }));
    }
  };

  onChangeFilter = event => {
    this.setState({ filter: event.currentTarget.value });
  };

  visibleContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter),
    );
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  render() {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase();
    const visibleContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter),
    );

    return (
      <Container>
        <h1>Phonebook</h1>
        <ContactForm onSubmit={this.addContact} />

        <h2>Contacts</h2>
        {contacts.length > 0 && (
          <Filter value={filter} onChange={this.onChangeFilter} />
        )}
        {visibleContacts.length ? (
          <ContactList
            contacts={visibleContacts.length ? visibleContacts : contacts}
            onDeleteContact={this.deleteContact}
          />
        ) : (
          <p>No contacts yet.</p>
        )}
      </Container>
    );
  }
}

export default App;
