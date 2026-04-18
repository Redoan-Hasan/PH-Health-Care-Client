"use client";
import  { useActionState } from 'react';
import { Field, FieldDescription, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { loginUser } from '@/services/auth/loginUser';
import { Button } from './ui/button';

const LoginForm = () => {
      const [state,formAction,isPending] = useActionState( loginUser, null)
      console.log("state", state, "isPending", isPending);
      const getFieldError = (fieldName: string) =>{
        if(state?.errors){
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const error = state.errors.find((err:any) => err.field === fieldName);
          return error;
        }
      }
      console.log("getFieldError", getFieldError("email"));
    return (
        <form action={formAction}>
      {/* {redirect && <input type="hidden" name="redirect" value={redirect} />} */}
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4">
          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              //   required
            />
              {getFieldError("email") && (
                <FieldDescription className="text-red-500">{getFieldError("email")?.message}</FieldDescription>
              )}
            {/* <InputFieldError field="email" state={state} /> */}
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              //   required
            />

            {getFieldError("password") && (
                <FieldDescription className="text-red-500">{getFieldError("password")?.message}</FieldDescription>
              )}
            {/* <InputFieldError field="password" state={state} /> */}
          </Field>
        </div>
        <FieldGroup className="mt-4">
          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </Button>

            <FieldDescription className="px-6 text-center">
              Don&apos;t have an account?{" "}
              <a href="/registration" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </FieldDescription>
            <FieldDescription className="px-6 text-center">
              <a
                href="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
    );
};

export default LoginForm;