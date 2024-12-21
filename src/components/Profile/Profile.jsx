import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Divider,
    useColorModeValue,
    Switch,
    HStack,
    Avatar,
    InputGroup,
    InputRightElement,
    useToast,
    Select,
} from '@chakra-ui/react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Profile = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const toast = useToast();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: '',
        password: '',
        metaToken: '',
        emailNotifications: true,
        timezone: 'UTC',
        language: 'en',
    });

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // TODO: API call to save profile
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast({
                title: 'Profile updated',
                description: 'Your profile has been updated successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error updating profile',
                description: 'There was an error updating your profile. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const Section = ({ title, children }) => (
        <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            border="1px"
            borderColor={borderColor}
            shadow="sm"
            w="100%"
        >
            <Heading size="md" mb={4}>{title}</Heading>
            {children}
        </Box>
    );

    return (
        <Container maxW="container.md" py={8}>
            <VStack spacing={8} align="stretch" as="form" onSubmit={handleSave}>
                <Box>
                    <Heading size="lg" mb={2}>Profile</Heading>
                    <Text color={textColor}>
                        Manage your account settings and preferences
                    </Text>
                </Box>

                {/* Personal Information */}
                <Section title="Personal Information">
                    <VStack spacing={4} align="stretch">
                        <HStack spacing={4} align="start">
                            <Avatar size="xl" name={`${formData.firstName} ${formData.lastName}`} />
                            <Button colorScheme="purple" size="sm" mt={2}>
                                Change Photo
                            </Button>
                        </HStack>
                        <HStack spacing={4}>
                            <FormControl>
                                <FormLabel>First Name</FormLabel>
                                <Input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Enter first name"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Last Name</FormLabel>
                                <Input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Enter last name"
                                />
                            </FormControl>
                        </HStack>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Phone</FormLabel>
                            <Input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />
                        </FormControl>
                    </VStack>
                </Section>

                {/* Professional Information */}
                <Section title="Professional Information">
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel>Company</FormLabel>
                            <Input
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Enter company name"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Job Title</FormLabel>
                            <Input
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                placeholder="Enter job title"
                            />
                        </FormControl>
                    </VStack>
                </Section>

                {/* Security */}
                <Section title="Security">
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel>Change Password</FormLabel>
                            <InputGroup>
                                <Input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                />
                                <InputRightElement width="4.5rem">
                                    <Button
                                        h="1.75rem"
                                        size="sm"
                                        onClick={() => setShowPassword(!showPassword)}
                                        variant="ghost"
                                    >
                                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                    </VStack>
                </Section>

                {/* API Keys */}
                <Section title="API Keys & Tokens">
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel>Meta Token</FormLabel>
                            <InputGroup>
                                <Input
                                    name="metaToken"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.metaToken}
                                    onChange={handleChange}
                                    placeholder="Enter Meta API token"
                                />
                                <InputRightElement width="4.5rem">
                                    <Button
                                        h="1.75rem"
                                        size="sm"
                                        onClick={() => setShowPassword(!showPassword)}
                                        variant="ghost"
                                    >
                                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                    </VStack>
                </Section>

                {/* Preferences */}
                <Section title="Preferences">
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel>Timezone</FormLabel>
                            <Select
                                name="timezone"
                                value={formData.timezone}
                                onChange={handleChange}
                            >
                                <option value="UTC">UTC</option>
                                <option value="EST">Eastern Time</option>
                                <option value="CST">Central Time</option>
                                <option value="PST">Pacific Time</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Language</FormLabel>
                            <Select
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                            </Select>
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel mb="0">
                                Email Notifications
                            </FormLabel>
                            <Switch
                                name="emailNotifications"
                                isChecked={formData.emailNotifications}
                                onChange={handleChange}
                                colorScheme="purple"
                            />
                        </FormControl>
                    </VStack>
                </Section>

                <Divider />

                {/* Save Button */}
                <Button
                    type="submit"
                    colorScheme="purple"
                    size="lg"
                    isLoading={isSaving}
                    loadingText="Saving..."
                >
                    Save Changes
                </Button>
            </VStack>
        </Container>
    );
};

export default Profile; 