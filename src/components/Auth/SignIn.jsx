import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Input,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    Container,
    VStack,
    InputGroup,
    InputLeftElement,
    Link,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import useAuthStore from '../../stores/authStore';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { login, error, clearError, user } = useAuthStore();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        clearError();

        try {
            await login(email, password);
        } catch (err) {
            // Error is handled by the store
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="md" py={12}>
            <VStack spacing={8} align="stretch">
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    textAlign="center"
                    color="gray.700"
                >
                    Sign in to your account
                </Text>

                <Box
                    bg="white"
                    p={8}
                    borderRadius="lg"
                    boxShadow="sm"
                    w="100%"
                >
                    {error && (
                        <Alert status="error" mb={4} borderRadius="md">
                            <AlertIcon />
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                    <EmailIcon color="gray.400" />
                                </InputLeftElement>
                                <Input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    size="lg"
                                />
                            </InputGroup>

                            <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                    <LockIcon color="gray.400" />
                                </InputLeftElement>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    size="lg"
                                />
                            </InputGroup>

                            <Button
                                type="submit"
                                colorScheme="brand"
                                size="lg"
                                width="100%"
                                isLoading={isLoading}
                                loadingText="Signing in"
                                spinner={<Spinner />}
                            >
                                Sign In
                            </Button>

                            <Link
                                onClick={() => navigate('/signup')}
                                color="brand.500"
                                textAlign="center"
                                fontSize="sm"
                                _hover={{ textDecoration: 'none', color: 'brand.600' }}
                            >
                                Don't have an account? Sign Up
                            </Link>
                        </VStack>
                    </form>
                </Box>
            </VStack>
        </Container>
    );
};

export default SignIn; 