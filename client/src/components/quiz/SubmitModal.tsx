import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import type { Question } from "../../store/quiz/type";

interface SubmitModalProps {
  visible: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  questions: Question[];
}

interface StatisticProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  colorClass: string;
}

const Statistic: React.FC<StatisticProps> = ({
  icon,
  title,
  value,
  colorClass,
}) => (
  <div className="flex flex-col items-center gap-2">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm font-medium">{title}</span>
    </div>
    <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
  </div>
);

const SubmitModal: React.FC<SubmitModalProps> = ({
  visible,
  onSubmit,
  onCancel,
  questions,
}) => {
  const [completed, skipped, remaining] = useMemo(
    () => filterQuestionsByCategory(questions),
    [questions]
  );

  return (
    <Dialog open={visible} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Quiz</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <h3 className="text-lg font-medium mb-4">
            Are you sure you want to submit the quiz? 🤔
          </h3>

          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4">
                <Statistic
                  icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                  title="Completed"
                  value={completed}
                  colorClass="text-green-500"
                />
                <Statistic
                  icon={<XCircle className="h-5 w-5 text-red-500" />}
                  title="Skipped"
                  value={skipped}
                  colorClass="text-red-500"
                />
                <Statistic
                  icon={<HelpCircle className="h-5 w-5 text-blue-500" />}
                  title="Remaining"
                  value={remaining}
                  colorClass="text-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const filterQuestionsByCategory = (questions: Question[]) => {
  const completed = questions.filter((q) => q.status === "completed").length;
  const skipped = questions.filter((q) => q.status === "skip").length;
  const remaining = questions.length - completed - skipped;
  return [completed, skipped, remaining];
};

export default SubmitModal;
