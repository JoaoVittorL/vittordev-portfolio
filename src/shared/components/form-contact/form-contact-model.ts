import {  useForm } from 'react-hook-form';
import { formContactSchema } from './form-contact.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import emailjs from 'emailjs-com';
import { toast } from 'sonner';
import {  z } from 'zod';
import { env } from '@/env';
import { useState } from 'react';


export const useFormContactModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {handleSubmit,register,formState: {errors},reset} =  useForm<z.infer<typeof formContactSchema>>({
    resolver: zodResolver(formContactSchema),
    mode: 'all',
    criteriaMode: 'all',
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  })

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    setIsLoading(true);
    try {
      const response = await emailjs.sendForm(
        env.VITE_SERVICE_EMAIL,
        env.VITE_TEMPLATE_ID_EMAIL,
        form,
        env.VITE_PUBLIC_KEY_EMAIL
      );

      if (response.status === 200) {
        reset();
        toast.success('Email enviado com sucesso. Em breve entraremos em contato.');
      } else {
        toast.error('Ocorreu um erro ao enviar a mensagem.');
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao enviar a mensagem.');
    } finally {
      setIsLoading(false);
    }
  };


  return {
    handleSubmitForm,
    handleSubmit,
    register,
    errors, 
    isLoading
  }
}