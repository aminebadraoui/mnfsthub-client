import React, { useState } from 'react';
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
    FormControl,
    FormErrorMessage,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import { FaUser } from 'react-icons/fa';
import { signUp } from '../../services/auth.service';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);

        try {
            await signUp(name, email, password);
            navigate('/signin');
        } catch (err) {
            setError(err.message || 'Failed to sign up');
        } finally {
            setIsLoading(false);
        }
    };

    const isPasswordError = confirmPassword && password !== confirmPassword;

    return (
        <Container maxW="md" py={12}>
            <VStack spacing={8} align="stretch">
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    textAlign="center"
                    color="gray.700"
                >
                    Create your account
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
                                    <FaUser color="var(--chakra-colors-gray-400)" />
                                </InputLeftElement>
                                <Input
                                    placeholder="Full Name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                    size="lg"
                                />
                            </InputGroup>

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
                                    autoComplete="new-password"
                                    size="lg"
                                />
                            </InputGroup>

                            <FormControl isInvalid={isPasswordError}>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <LockIcon color="gray.400" />
                                    </InputLeftElement>
                                    <Input
                                        type="password"
                                        placeholder="Confirm Password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        size="lg"
                                    />
                                </InputGroup>
                                <FormErrorMessage>
                                    Passwords do not match
                                </FormErrorMessage>
                            </FormControl>

                            <Button
                                type="submit"
                                colorScheme="brand"
                                size="lg"
                                width="100%"
                                isLoading={isLoading}
                                loadingText="Creating Account"
                                spinner={<Spinner />}
                            >
                                Create Account
                            </Button>

                            <Link
                                onClick={() => navigate('/signin')}
                                color="brand.500"
                                textAlign="center"
                                fontSize="sm"
                                _hover={{ textDecoration: 'none', color: 'brand.600' }}
                            >
                                Already have an account? Sign In
                            </Link>
                        </VStack>
                    </form>
                </Box>
            </VStack>
        </Container>
    );
};

export default SignUp;