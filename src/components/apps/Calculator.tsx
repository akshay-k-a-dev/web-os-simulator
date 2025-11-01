import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Backspace } from '@phosphor-icons/react';

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleNumber = (num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (shouldResetDisplay) {
      setDisplay('0.');
      setShouldResetDisplay(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display);
    
    if (previousValue !== null && operation && !shouldResetDisplay) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(currentValue);
    }
    
    setOperation(op);
    setShouldResetDisplay(true);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '×':
        return prev * current;
      case '÷':
        return current !== 0 ? prev / current : 0;
      case '%':
        return prev % current;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setShouldResetDisplay(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleToggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  return (
    <div className="flex flex-col h-full bg-background p-4">
      <Card className="w-full max-w-sm mx-auto shadow-lg">
        <div className="p-6 space-y-4">
          <div className="bg-muted rounded-lg p-4 min-h-[80px] flex flex-col justify-end">
            {operation && previousValue !== null && (
              <div className="text-xs text-muted-foreground mb-1">
                {previousValue} {operation}
              </div>
            )}
            <div className="text-4xl font-bold text-right break-all">
              {display}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="secondary"
              className="h-14 text-lg font-semibold"
              onClick={handleClear}
            >
              C
            </Button>
            <Button
              variant="secondary"
              className="h-14 text-lg font-semibold"
              onClick={handleToggleSign}
            >
              +/-
            </Button>
            <Button
              variant="secondary"
              className="h-14 text-lg font-semibold"
              onClick={() => handleOperation('%')}
            >
              %
            </Button>
            <Button
              variant="default"
              className="h-14 text-lg font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => handleOperation('÷')}
            >
              ÷
            </Button>

            <Button
              variant="outline"
              className="h-14 text-lg font-semibold"
              onClick={() => handleNumber('7')}
            >
              7
            </Button>
            <Button
              variant="outline"
              className="h-14 text-lg font-semibold"
              onClick={() => handleNumber('8')}
            >
              8
            </Button>
            <Button
              variant="outline"
              className="h-14 text-lg font-semibold"
              onClick={() => handleNumber('9')}
            >
              9
            </Button>
            <Button
              variant="default"
              className="h-14 text-lg font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => handleOperation('×')}
            >
              ×
            </Button>

            <Button
              variant="outline"
              className="h-14 text-lg font-semibold"
              onClick={() => handleNumber('4')}
            >
              4
            </Button>
            <Button
              variant="outline"
              className="h-14 text-lg font-semibold"
              onClick={() => handleNumber('5')}
            >
              5
            </Button>
            <Button
              variant="outline"
              className="h-14 text-lg font-semibold"
              onClick={() => handleNumber('6')}
            >
              6
            </Button>
            <Button
              variant="default"
              className="h-14 text-lg font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => handleOperation('-')}
            >
              -
            </Button>

            <Button
              variant="outline"
              className="h-14 text-lg font-semibold"
              onClick={() => handleNumber('1')}
            >
              1
            </Button>
            <Button
              variant="outline"
              className="h-14 text-lg font-semibold"
              onClick={() => handleNumber('2')}
            >
              2
            </Button>
            <Button
              variant="outline"
              className="h-14 text-lg font-semibold"
              onClick={() => handleNumber('3')}
            >
              3
            </Button>
            <Button
              variant="default"
              className="h-14 text-lg font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => handleOperation('+')}
            >
              +
            </Button>

            <Button
              variant="outline"
              className="h-14 text-lg font-semibold col-span-2"
              onClick={() => handleNumber('0')}
            >
              0
            </Button>
            <Button
              variant="outline"
              className="h-14 text-lg font-semibold"
              onClick={handleDecimal}
            >
              .
            </Button>
            <Button
              variant="default"
              className="h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleEquals}
            >
              =
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={handleBackspace}
          >
            <Backspace className="h-4 w-4 mr-2" />
            Backspace
          </Button>
        </div>
      </Card>
    </div>
  );
};
