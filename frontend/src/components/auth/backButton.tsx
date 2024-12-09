import React from "react";
import { Button } from "../ui/button";

interface BackButtonProps {
  label: string;
  href: string;
}

const BackButton: React.FC<BackButtonProps> = ({ label, href }) => {
  return (
    <Button variant="link" className="font-normal w-full" size="sm" asChild>
      <a href={href}>{label}</a>
    </Button>
  );
};

export default BackButton;
