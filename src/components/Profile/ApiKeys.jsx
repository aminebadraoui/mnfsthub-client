import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    useColorModeValue,
    Text,
    InputGroup,
    InputRightElement,
    useToast,
    Container,
    Heading,
} from '@chakra-ui/react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const ApiKeys = () => {
    const [metaToken, setMetaToken] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // TODO: API call to save token
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            toast({
                title: 'Token saved',
                description: 'Your Meta token has been saved successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error saving token',
                description: 'There was an error saving your token. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Container maxW="container.md" py={8}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading size="lg" mb={2}>API Keys & Tokens</Heading>
                    <Text color={textColor}>
                        Manage your API keys and access tokens for various integrations.
                    </Text>
                </Box>

                <Box
                    as="form"
                    onSubmit={handleSave}
                    bg={bgColor}
                    p={6}
                    borderRadius="lg"
                    border="1px"
                    borderColor={borderColor}
                    shadow="sm"
                >
                    <VStack spacing={6}>
                        <FormControl id="metaToken">
                            <FormLabel>Meta Token</FormLabel>
                            <InputGroup size="md">
                                <Input
                                    type={showToken ? 'text' : 'password'}
                                    value={metaToken}
                                    onChange={(e) => setMetaToken(e.target.value)}
                                    placeholder="Enter your Meta API token"
                                />
                                <InputRightElement width="4.5rem">
                                    <Button
                                        h="1.75rem"
                                        size="sm"
                                        onClick={() => setShowToken(!showToken)}
                                        variant="ghost"
                                    >
                                        {showToken ? <MdVisibilityOff /> : <MdVisibility />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="purple"
                            width="full"
                            isLoading={isSaving}
                            loadingText="Saving..."
                        >
                            Save Token
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default ApiKeys; 