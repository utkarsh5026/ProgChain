import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Level } from "../../store/quiz/type";
import useQuiz from "../../store/quiz/hook";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Check, X, PlayCircle } from "lucide-react";

interface QuizSetupModalProps {
  visible: boolean;
  onOpenChange?: (open: boolean) => void;
}

const difficultyLevels: Level[] = ["easy", "medium", "hard"];

const formSchema = z.object({
  topic: z.string().min(1, "Please enter a topic"),
  levels: z
    .array(z.enum(["easy", "medium", "hard"]))
    .min(1, "Please select at least one level"),
  instructions: z.string().optional(),
  count: z.number().min(5).max(30),
});

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1">
        {value.map((selectedValue) => {
          const option = options.find((opt) => opt.value === selectedValue);
          return (
            <Badge
              key={selectedValue}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {option?.label}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => handleRemove(selectedValue)}
              />
            </Badge>
          );
        })}
      </div>
      <Command className="border rounded-md">
        <CommandInput placeholder="Search levels..." />
        <CommandEmpty>No level found.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={() => handleSelect(option.value)}
              className="cursor-pointer"
            >
              <Check
                className={`mr-2 h-4 w-4 ${
                  value.includes(option.value) ? "opacity-100" : "opacity-0"
                }`}
              />
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </div>
  );
};

/**
 * Modal component for setting up a new quiz.
 * Allows users to specify topic, difficulty levels, and additional instructions.
 */
const QuizSetupModal: React.FC<QuizSetupModalProps> = ({
  visible,
  onOpenChange,
}) => {
  const { fecthQuiz } = useQuiz();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      levels: [],
      instructions: "",
      count: 10,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await fecthQuiz(values);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={visible} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quiz Setup</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="levels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Levels</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={difficultyLevels.map((level) => ({
                        value: level,
                        label: level.charAt(0).toUpperCase() + level.slice(1),
                      }))}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Instructions</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="count"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Number of Questions: {value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={5}
                      max={30}
                      step={1}
                      value={[value]}
                      onValueChange={(vals) => onChange(vals[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full">
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Quiz
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuizSetupModal;
