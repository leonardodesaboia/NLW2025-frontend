import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateQuestionRequest } from "./types/create-question-request";
import type { CreateQuestionResponse } from "./types/create-question-response";
import type { GetRoomQuestionsResponse } from "./types/get-room-questions-response";

export function useCreateQuestion(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateQuestionRequest) => {
      const response = await fetch(
        `http://localhost:3333/rooms/${roomId}/questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result: CreateQuestionResponse = await response.json();

      return result;
    },
    onMutate({question}){
      const questions = queryClient.getQueryData<GetRoomQuestionsResponse[]>([
        "get-questions",
        roomId,
      ]);

      const questionsArray = questions ?? [];

      const newQuestion = {
        id: crypto.randomUUID(),
        question,
        answer: null,
        createdAt: new Date().toISOString(),
        isGeneratingAnswer: true,
      };

      queryClient.setQueryData(
        ["get-questions", roomId],
        [
          newQuestion,
          ...questionsArray,
        ]
      );
      return { newQuestion, questions }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-questions", roomId],
      });
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(
        ["get-questions", roomId],
        context?.questions
      );
    },


  });
}
