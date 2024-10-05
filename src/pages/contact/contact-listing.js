import React, {useEffect, useState} from 'react';
import axiosInstance from "../auth/axiosInstance";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Container
} from '@mui/material';

function ContactListing() {
    const [contacts, setContacts] = useState([]);

    const fetchContacts = async () => {
        try {
            const response = await axiosInstance.get('/contact');
            setContacts(response.data.data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <Container sx={{mt: 4}}>
            <Typography variant="h4" component="h2" sx={{mb: 4}}>
                Contact List
            </Typography>
            <Grid container spacing={3}>
                {contacts.map((contact) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={contact._id}>
                        <Card sx={{height: '100%'}}>
                            <CardContent>
                                <Typography variant="h6" component="div" gutterBottom>
                                    {contact.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <strong>Email:</strong> {contact.email}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <strong>Phone:</strong> {contact.phone_number}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{mt: 1}}>
                                    <strong>Message:</strong> {contact.message}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default ContactListing;
