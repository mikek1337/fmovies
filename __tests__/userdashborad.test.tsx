import * as Rece  from '@/components/recentviewed';
import UserDashboard from '@/components/userdashborad';
import type { RecentlyViewed } from '@prisma/client';
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
        const recentlyViewed:RecentlyViewed[] = [
            {
                id: "1",
                userId: "1",
                mediaId: "1",
                MediaType: "movie",
                poster_path: "https://test.com",
                title: "Test",
                createdAt: new Date(),
            }
        ];
        render(
            <Rece.default recentlyViewed={recentlyViewed}/>
        );
        expect(screen.getByText("Recently Viewed")).toBeInTheDocument();
    })
    it("Check No Recently Viewed is rendered", ()=>{
        const recentlyViewed:RecentlyViewed[] = [];
        render(
            <Rece.default recentlyViewed={recentlyViewed}/>
        );
        expect(screen.getByText("No Recently Viewed")).toBeInTheDocument();
    })
})