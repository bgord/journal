import { useCallback, useState } from "react";

export enum RequestState {
  idle = "idle",
  loading = "loading",
  error = "error",
  done = "done",
}

type UseMutationOptions = {
  perform: () => Promise<Response>;
  onSuccess?: (response: Response) => void | Promise<void>;
  onError?: (error: unknown) => void | Promise<void>;
  autoResetDelayMs?: number;
};

type UseMutationReturnType = {
  state: RequestState;
  error: unknown;
  isIdle: boolean;
  isLoading: boolean;
  isError: boolean;
  isDone: boolean;
  mutate: () => Promise<Response | undefined>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  reset: () => void;
};

export function useMutation(options: UseMutationOptions): UseMutationReturnType {
  const [state, setState] = useState<RequestState>(RequestState.idle);
  const [error, setError] = useState<unknown>(null);

  const reset = useCallback(() => {
    setError(null);
    setState(RequestState.idle);
  }, []);

  const mutate = useCallback(async () => {
    if (state === RequestState.loading) return;

    setError(null);
    setState(RequestState.loading);

    try {
      const response = await options.perform();

      if (!response.ok) {
        setState(RequestState.error);
        setError(null);
        await options.onError?.(null);
      }

      setState(RequestState.done);
      await options.onSuccess?.(response);

      if (options.autoResetDelayMs) {
        setTimeout(() => setState(RequestState.idle), options.autoResetDelayMs);
      }

      return response;
    } catch (error) {
      setState(RequestState.error);
      setError(error);
      await options.onError?.(error);
      throw error;
    }
  }, [state, options]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (submitEvent) => {
      submitEvent.preventDefault();
      await mutate();
    },
    [mutate],
  );

  return {
    state,
    error,
    isIdle: state === RequestState.idle,
    isLoading: state === RequestState.loading,
    isError: state === RequestState.error,
    isDone: state === RequestState.done,
    mutate,
    handleSubmit,
    reset,
  };
}
