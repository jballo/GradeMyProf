'use client';
import { Box, Button, Stack, TextField, Typography, Avatar } from "@mui/material";
import { useEffect, useState } from "react";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Chat({ professorData }) {
    const [messages, setMessages] = useState([{
        role: "assistant",
        content: "Hi! I'm the GradeMyProf assistant. How can I help you today?",
    }]);

    const [message, setMessage] = useState("");

    const sendMessage = async () => {
        setMessages((messages) => [
            ...messages,
            { role: "user", content: message },
            { role: "assistant", content: "" },
        ]);

        setMessage("");
        const response = fetch('/api/conversation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([...messages, { role: "user", content: message }]),
        })
        .then(async (res) => {
            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            let result = '';
            return reader.read().then(function processText({ done, value }) {
                if (done) {
                    return result;
                }

                const text = decoder.decode(value || new Uint8Array(), { stream: true });
                setMessages((messages) => {
                    let lastMessage = messages[messages.length - 1];
                    let otherMessages = messages.slice(0, messages.length - 1);
                    return [
                        ...otherMessages,
                        { ...lastMessage, content: lastMessage.content + text },
                    ];
                });

                return reader.read().then(processText);
            });
        });
    };

    return (
        <Box
            width='100%'
            height='55vh'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            
        >
            <Stack
                direction='column'
                width='100%'
                height='100%'
                border='1px solid #D8BFD8'
                borderRadius={2}
                bgcolor='#b899c7'
                p={2}
                spacing={3}
            >
                <Stack
                    direction='column'
                    spacing={2}
                    flexGrow={1}
                    sx={{
                        maxHeight: '100%',
                        overflow: 'auto',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none', 
                        '&::-webkit-scrollbar': {
                            width: 0,
                            height: 0,
                        },
                    }}
                >
                    {messages.map((message, index) => (
                        <Box
                            key={index}
                            display='flex'
                            justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
                        >
                            {message.role === 'assistant' && (
                                <Avatar
                                    sx={{
                                        bgcolor: '#D8BFD8',
                                        color: '#906aa3',
                                        marginRight: 2,
                                    }}
                                    src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1724803200&semt=ais_hybrid"
                                />
                            )}
                            <Box
                                bgcolor={message.role === 'assistant' ? '#D8BFD8' : '#fce2db'}
                                color={message.role === 'assistant' ? 'black' : 'black'}
                                borderRadius={2}
                                p={2}
                                maxWidth='70%'
                                border='1px solid #fce2db'
                            >
                                {message.role === 'assistant' ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {message.content}
                                    </ReactMarkdown>
                                ) : (
                                    message.content
                                )}
                            </Box>
                        </Box>
                    ))}
                </Stack>
                <Stack
                    direction='row'
                    spacing={2}
                >
                    <TextField
                        label='Message'
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        sx={{
                            bgcolor: '#fce2db',
                            borderRadius: 2,
                        }}
                    />
                    <Button
                        variant='contained'
                        onClick={sendMessage}
                        sx={{
                            bgcolor: '#906aa3',
                            color: '#fce2db',
                            '&:hover': {
                                bgcolor: '#73447b'
                            }
                        }}
                    >
                        Send
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
