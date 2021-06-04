import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { request } from '../util/request'

export default function Home() {
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()
  const onSubmit = useCallback(async (data: any) => {
    setError('')
    try {
      await request('/api/push', {
        data,
      })
      reset()
    } catch (err) {
      setError(err)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 pt-10">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-3xl p-5 mb-10">
        <div className="mb-2 space-y-2">
          <h3>Step 1:</h3>
          <p className="text-sm">
            Go to{' '}
            <a
              href="https://t.me/tob2pbot"
              target="_blank"
              className="text-green-500 underline hover:no-underline"
            >
              t.me/tob2pbot
            </a>{' '}
            and follow the bot.
          </p>
        </div>
        <div className="mb-2 space-y-2">
          <h3>Step 2:</h3>
          <p className="text-sm">Enter the /start command to get your token.</p>
        </div>
        <div className="mb-2 space-y-2">
          <h3>Step 3:</h3>
          <p className="text-sm">
            Then enter the token and content in the form and you can receive
            messages on Telegram.
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto bg-white shadow-md rounded-3xl p-5"
      >
        <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
          <div className="w-full flex flex-col mb-3">
            <label className="font-semibold text-gray-600 py-2">Token</label>
            <input
              {...register('token', { required: 'Please enter token' })}
              placeholder="Enter token"
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4"
              type="text"
            />
          </div>
        </div>

        <div className="flex-auto w-full mb-1 text-xs space-y-2">
          <label className="font-semibold text-gray-600 py-2">Content</label>
          <textarea
            {...register('content', { required: 'Please enter content' })}
            className="h-28 appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg py-4 px-4"
            placeholder="Enter content"
            spellCheck="false"
          ></textarea>
          {/* <p className="text-xs text-gray-400 text-left my-3">
            You inserted 0 characters
          </p> */}
        </div>
        <p className="text-xs text-red-500 text-right my-3">
          {(errors.token && errors.token.message) ||
            (errors.content && errors.content.message) ||
            error}
        </p>

        <div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
          <button
            type="reset"
            className="transition mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            type="submit"
            className="transition mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
