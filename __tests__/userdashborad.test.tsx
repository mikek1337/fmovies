import UserDashboard from '@/components/userdashborad';
import {render, screen} from '@testing-library/react';
describe("UserDashboard", ()=>{
   const userSession = {
        user: {
            name: "John Doe",
            email: "test@gmail.com",
            image: "https://test.com",
        }
    }
    it("Check Component is rendered", ()=>{
        render(
        <UserDashboard userSession={userSession.user}>
            <div>Test</div>
        </UserDashboard>);
        expect(screen.getByText(`Welcome, ${userSession.user.name}`)).toBeInTheDocument();
    })
    it("Check Recently Viewed is rendered", ()=>{
        render(
            <RecentlyViewed userId={1}/>
        );
        expect(screen.getByText("Recently Viewed")).toBeInTheDocument();
    })
})