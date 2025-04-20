import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { OTPInput } from '@/components/common/OTPInput';

// Updated form schema without password
const formSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required')

});

type FormValues = z.infer<typeof formSchema>;

interface EmailRegistrationFormProps {
  onComplete: (email: string) => void;
  loading: boolean;
}

export const EmailRegistrationForm = ({ onComplete, loading }: EmailRegistrationFormProps): JSX.Element => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      // TODO: Implement your registration API call here to send OTP
      console.log('Form values:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the email for later use
      setRegisteredEmail(values.email);
      
      // Show OTP verification after successful email submission
      setShowOTP(true);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement your OTP verification API call here
      console.log('OTP:', otp);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call onComplete with the registered email
      onComplete(registeredEmail);
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackFromOTP = () => {
    setShowOTP(false);
    setOtp('');
  };

  if (showOTP) {
    return (
      <OTPInput
        otp={otp}
        setOtp={setOtp}
        loading={isLoading}
        onVerify={handleOTPVerification}
        onBack={handleBackFromOTP}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
        

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  disabled={isLoading}
                  placeholder={
                    language === 'id' ? 'Masukkan email' : 'Enter email'
                  }
                  className="rounded-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-earth-dark-green hover:bg-earth-medium-green h-12 w-full rounded-full text-base"
        >
          {isLoading
            ? language === 'id'
              ? 'Mengirim OTP...'
              : 'Sending OTP...'
            : language === 'id'
            ? 'Kirim OTP'
            : 'Send OTP'}
        </Button>
      </form>
    </Form>
  );
};
