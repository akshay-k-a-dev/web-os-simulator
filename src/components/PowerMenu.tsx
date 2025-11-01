import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Power, ArrowClockwise, Moon } from '@phosphor-icons/react';

interface PowerMenuProps {
  onShutdown: () => void;
  onRestart: () => void;
  onSleep: () => void;
}

export const PowerMenu: React.FC<PowerMenuProps> = ({
  onShutdown,
  onRestart,
  onSleep,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="h-9 w-9" title="Power">
          <Power className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" side="top" align="end">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="justify-start gap-3 h-10"
            onClick={onSleep}
          >
            <Moon className="h-5 w-5" />
            <span>Sleep</span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-3 h-10"
            onClick={onRestart}
          >
            <ArrowClockwise className="h-5 w-5" />
            <span>Restart</span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-3 h-10"
            onClick={onShutdown}
          >
            <Power className="h-5 w-5" />
            <span>Shutdown</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
