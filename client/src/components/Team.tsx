import ProfileCard from "./ProfileCard";

export default function TeamMemberList() {
  return (
    <div className="px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        <ProfileCard
          name="Ashish Yadav"
          title="Vice President"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/dxaq078zo/image/upload/v1770464336/Ashish_wbg_elow3t.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        />
        <ProfileCard
          name="Shreya"
          title="President"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/dxaq078zo/image/upload/v1770464338/Shreya_wbg_v00gmo.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        />
        <ProfileCard
          name="Kushgra Kumar"
          title="Vice President"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/dxaq078zo/image/upload/v1770464338/kushagra_wbg_kdge1e.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        />
        {/* <ProfileCard
          name="Aushutosh Kumar"
          title="Technical Executive"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/drfwbriwh/image/upload/v1770476259/Ashutosh_xjfewc.jpg"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        /> */}
        <ProfileCard
          name="Mayank Maurya"
          title="Technical Head"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/drfwbriwh/image/upload/v1770560780/Screenshot_2026-02-08_195155-removebg-preview_tioe5y.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        />

        {/* <ProfileCard
          name="Vedant Singh"
          title="Technical Executive"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/drfwbriwh/image/upload/v1770476203/Vedant_Singh_joun3q.jpg"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        /> */}
        
          <ProfileCard
          name="Sudipta Das"
          title="Technical Head"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/drfwbriwh/image/upload/v1770561544/Screenshot_2026-02-08_195134-removebg-preview_zmlbyu.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        />
        
        <ProfileCard
          name="Devisha"
          title="Dev Club President"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/drfwbriwh/image/upload/v1770560613/Screenshot_2026-02-08_195230-removebg-preview_xalx7m.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        />

        <ProfileCard
          name="SHWETA"
          title="Dev Club Vice President"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/drfwbriwh/image/upload/v1770561281/Screenshot_2026-02-08_195211-removebg-preview_nfmcxj.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        />
      
          
          <ProfileCard
          name="Mohit Kumar"
          title="Designing Head"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/drfwbriwh/image/upload/v1770560861/Screenshot_2026-02-08_195034-removebg-preview_zy17g3.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        />

         <ProfileCard
          name="Agrima Dwivedi"
          title="Designing Head"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/drfwbriwh/image/upload/v1770560972/Screenshot_2026-02-08_195050-removebg-preview_bfg3ob.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        />

         <ProfileCard
          name="Abhinav Pratap Rai"
          title="Event Head"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/drfwbriwh/image/upload/v1770561069/Screenshot_2026-02-08_194945-removebg-preview_b5d4ny.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        />

          <ProfileCard
          name="Pankaj Kumar"
          title="Logistic Head"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/drfwbriwh/image/upload/v1770561961/Screenshot_2026-02-08_194848-removebg-preview_s35a0j.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        />
             

      
          <ProfileCard
          name="Anshita"
          title="Editorial Head"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/drfwbriwh/image/upload/v1770561199/Screenshot_2026-02-08_195012-removebg-preview_oetnqa.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        />
      

        
          <ProfileCard
          name="Raunak Khandelwal"
          title="Esports Team Head"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/drfwbriwh/image/upload/v1770562073/Screenshot_2026-02-08_201718-removebg-preview_pmpc5n.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        />

           <ProfileCard
          name="Swarnim Raj"
          title="Esports Team Head"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/drfwbriwh/image/upload/v1770561667/Screenshot_2026-02-08_195116-removebg-preview_pj8fd3.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        />

           <ProfileCard
          name="Vivek Singh"
          title="Social Media Head"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/drcjxszdp/image/upload/v1770555388/vk_copy_usr6ew.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        />

        <ProfileCard
          name="Harshita Sharma"
          title="PR Head"
          handle="javicodes"
          status="Online"
          avatarUrl="https://res.cloudinary.com/drfwbriwh/image/upload/v1770561859/Screenshot_2026-02-08_201323-removebg-preview_x9qtpt.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          githubUrl="https://github.com/javicodes"
          linkedinUrl="https://linkedin.com/in/javicodes"
          onGithubClick={() => console.log("GitHub clicked")}
          onLinkedinClick={() => console.log("LinkedIn clicked")}
        />

        
             

        
                   
      </div>
    </div>
  );
}
