import { SafeAreaView } from 'react-native-safe-area-context'
import { Masthead } from '@canchaya/ui/native'
import { AuthForm } from '@/components/auth/AuthForm'

export default function Signup() {
  return (
    <SafeAreaView className="flex-1 bg-cy-bg" edges={['top', 'bottom']}>
      <Masthead section="REGISTRO · NUEVA CUENTA" />
      <AuthForm initialMode="signup" />
    </SafeAreaView>
  )
}
