The software version is one of the main characteristics that describe the level of software change,
and the level of preparation for use changes.
On this project, a four-digit versioning system has been adopted.


1. The number of the global release, changes when adding functions that can be classified as major,
 or with a radical change in the interface. When you change the version of a global release,
 you need to update the documentation to describe what's new and conduct a retrospective of use of functions.
2. The number indicating the addition of new minor functions, the change of which requires the creation of information 
 about new functions, and full testing of all changes made.
3. The number indicating the stage of testing can take the following values
    0 - alpha testing (inside the company)
    1 - beta testing (by external users)
    2 - RC version (Release candidate, pre-release, Pre) - this is the stage of the candidate to become final. 
    Programs at this stage have passed all comprehensive testing, due to which all critical errors are fixed, however, 
    the probability of finding some errors remains
4. Internal designation of the development stage, and preparation for the next release. 
However, does not confirm the readiness and quality of the released functions

#### A few examples
0.0.1 - The first public release for testing function by real users

1.0.1 - The version with the main functions and the project is at the stage of comprehensive testing, documentation, etc.

1.2.3 - This version means that after the first global release, additional features were added, 
 which beat well tested and published for use by real users. 
 At this stage, the project does not require ongoing support, existing functions.