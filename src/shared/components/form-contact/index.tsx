import { Loader2, Send } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { useFormContactModel } from "./form-contact-model"

export function FormContact() {
  const {handleSubmitForm,handleSubmit,register,errors,isLoading} = useFormContactModel()
  return  <form onSubmit={(e) => {
    handleSubmit(() => handleSubmitForm(e))(e);
  }}  className="space-y-2">
    <div>
        <Label htmlFor="name">Nome</Label>
        <Input autoComplete="off" id="name" {...register('name')} placeholder="Digite seu nome" error={errors.name?.message} disabled={isLoading}/>
    </div>
    <div>
        <Label htmlFor="email">E-mail</Label>
        <Input autoComplete="off" type="email" id="email" {...register('email')}  placeholder="Digite seu email" error={errors.email?.message} disabled={isLoading}/>
    </div>
    <div>
        <Label htmlFor="message">Mensagem</Label>
        <Textarea  autoComplete="off" id="message" {...register('message')} rows={10} placeholder="Digite sua mensagem" disabled={isLoading} className={errors.message?.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500 resize-none' : 'resize-none'} />
    </div>
    <Button type="submit" size={'full'} disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} {isLoading ? 'Enviando...' : 'Enviar'}</Button>
</form>
}