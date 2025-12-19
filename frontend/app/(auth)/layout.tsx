const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex-center min-h-screen w-full bg-purple-50">
            <div className="bg-white p-8 rounded-lg shadow-md">
                {children}
            </div>
        </div>
    );
};
export default AuthLayout;
