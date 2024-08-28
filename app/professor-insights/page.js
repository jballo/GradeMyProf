'use client';

import { useEffect, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import Header from "../components/Header";




export default function Page() {
    const [url, setUrl] = useState('');
    const [professorData, setProfessorData] = useState(null);

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    }

    const processProfessorInfo = (data) => {
        fetch('/api/process_prof_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            console.log('Success');
            console.log(data);
        })
        .catch(err => {
            console.log('Error: ', err);
        })
    }




    const submitUrl = () => {
        fetch('/api/retrieve_prof_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                professorUrl: url
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log('Success');
            // console.log(data);
            console.log('Returned Professor Data: ', data);
            const newProfessorData = data
            // once data is successfully retrieved, send it to the process_prof_data route
            // processProfessorInfo(data);
            setProfessorData(newProfessorData);
            
        })
        .catch(err => {
            console.log('Error: ', err);
        })
    }

    useEffect(() => {
        console.log('Professor Data Changed: ', professorData);
        if (professorData !== null) {
            console.log('Professor Data: ', professorData);
            processProfessorInfo(professorData);
        }
    }, [professorData]);

    return (
        <Box
            width='100vw'
            height='100vh'
            bgcolor='#FCE2DB'
        >
            <Header />
            <Stack
                direction='row'
                justifyContent='flex-end'
            >
                <TextField 
                    label='Enter Url Here...'
                    variant='standard'
                    size='small'
                    sx={{
                        width: '30%',
                        marginRight: '2rem'
                    }}
                    value={url}
                    onChange={handleUrlChange}
                />
                <Button
                    variant='contained'
                    color='primary'
                    sx={{
                        height: '40px'
                    }}
                    onClick={submitUrl}
                >
                    Submit
                </Button>
            </Stack>
        </Box>
    );
}