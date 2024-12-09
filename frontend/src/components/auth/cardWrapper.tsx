"use client";
import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import AuthHeader from "./authHeader";
import BackButton from "./backButton";

interface CradWrapperProps {
  label: string;
  title: string;
  backButtonHref: string;
  backButtonLabel: string;
  children: React.ReactNode;
}
const CardWrapper: React.FC<CradWrapperProps> = ({
  label,
  title,
  backButtonHref,
  backButtonLabel,
  children,
}) => {
  return (
    <Card className="xl:w-1/4 md:w-1/2 shadow-md">
      <CardHeader>
        <AuthHeader title={title} label={label} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
