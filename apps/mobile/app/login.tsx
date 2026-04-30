import { SafeAreaView } from 'react-native-safe-area-context'
import { Masthead } from '@canchaya/ui/native'
import { AuthForm } from '@/components/auth/AuthForm'

export default function Login() {
  return (
    <SafeAreaView className="flex-1 bg-cy-bg" edges={['top', 'bottom']}>
      <Masthead section="ACCESO · JUGADOR" />
      <AuthForm initialMode="signin" />
    </SafeAreaView>
  )
}
