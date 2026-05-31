import * as Rece  from '@/components/recentviewed';
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
        const recentlyViewed = [
            {
                id: "1",
                userId: "1",
                mediaId: "1",
                MediaType: "movie",
                poster_path: "/test.jpg",
                title: "Test",
                season: null,
                episodeId: null,
                createdAt: new Date(),
            }
        ];
        render(
            <Rece.default recentlyViewed={recentlyViewed}/>
        );
        expect(screen.getByText("Test")).toBeInTheDocument();
    })
    it("Check No Recently Viewed renders nothing", ()=>{
        const recentlyViewed: {
    id: string;
    mediaId: string;
    MediaType: string;
    userId: string;
    poster_path: string;
    title: string;
    season: number | null;
    episodeId: number | null;
    createdAt: Date;
    }[] = [];
        const {container} = render(
            <Rece.default recentlyViewed={recentlyViewed}/>
        );
        expect(container.innerHTML).toBeFalsy();
    })
})
