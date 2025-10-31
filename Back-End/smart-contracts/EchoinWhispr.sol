// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title EchoinWhispr
 * @dev This contract manages user personas, subscriptions, and the data
 * required for the anonymous, decentralized messaging system.
 */


contract EchoinWhispr is ReentrancyGuard {

    // --- Structs ---

    /**
     * @dev Defines the core anonymous user persona.
     * All data here is publicly readable but anonymized.
     */
    struct UserProfile {
        string career;           // e.g., "Software Engineer"
        mapping(string => bool) interests; // e.g., {"DeFi": true, "NFTs": true}
        string currentMood;      // e.g., "Creative"
        bytes publicKey;         // Public key (bytes) for ECIES encryption
        bytes32 mailHash;        // Public, static, anonymous hash for receiving new messages
        uint subscriptionEnds;   // block.timestamp when subscription expires
        bool isInitialized;      // Flag to check if user exists
    }

    /**
     * @dev View struct for returning user profile with interests as array.
     */
    struct UserProfileView {
        string career;
        string[] interests;
        uint interestsCount;
        string currentMood;
        bytes publicKey;
        bytes32 mailHash;
        uint subscriptionEnds;
        bool isInitialized;
    }

    // --- State Variables ---

    // Governance & Settings
    address public owner;
    uint public hbarSubscriptionPrice;  // Price in tinybars (e.g., 10 HBAR = 1_000_000_000_000 tinybars)
    uint public htsSubscriptionPrice;   // Price in the smallest denomination of the HTS token
    address public htsTokenAddress;      // The address of the accepted HTS subscription token
    mapping(address => bool) public whitelistedTokens; // Whitelist for allowed HTS tokens

    // Fixed interests for validation
    string[] public fixedInterests = ["DeFi", "NFTs", "Gaming", "AI", "Web3", "Crypto", "Art", "Music", "Sports", "Travel"];
    mapping(string => bool) public validInterests;

    // Core Data
    mapping(address => UserProfile) public users;
    address[] public userIndex; // Index of all user addresses for iteration (for search/match)

    // --- Events ---
    event UserRegistered(address indexed user);
    event PersonaUpdated(address indexed user);
    event SubscriptionGranted(address indexed user, uint expiresOn);
    event HbarPriceSet(uint oldPrice, uint newPrice);
    event HtsPriceSet(uint oldPrice, uint newPrice);
    event HtsTokenAddressSet(address oldAddress, address newAddress);
    event TokenAddedToWhitelist(address indexed token);
    event TokenRemovedFromWhitelist(address indexed token);

    // --- Modifiers ---
    modifier onlyOwner() {
        require(msg.sender == owner, "EchoinWhispr: Caller is not the owner");
        _;
    }

    modifier userExists() {
        require(users[msg.sender].isInitialized, "EchoinWhispr: User does not exist");
        _;
    }

    modifier userDoesNotExist() {
        require(!users[msg.sender].isInitialized, "EchoinWhispr: User already exists");
        _;
    }

    modifier userInitialized(address _user) {
        require(users[_user].isInitialized, "EchoinWhispr: User does not exist");
        _;
    }

    // --- Helper Functions ---
    function _validateString(string memory str, uint maxLen) private pure {
        bytes memory b = bytes(str);
        require(b.length <= maxLen, "EchoinWhispr: String exceeds maximum length");
        for (uint i = 0; i < b.length; i++) {
            require(uint8(b[i]) >= 32 && uint8(b[i]) != 127, "EchoinWhispr: Control characters not allowed");
        }
    }

    // --- Constructor ---
    constructor(uint _hbarPrice, uint _htsPrice, address _htsToken) {
        require(_htsToken != address(0), "EchoinWhispr: HTS token address cannot be zero");
        owner = msg.sender;
        hbarSubscriptionPrice = _hbarPrice;
        htsSubscriptionPrice = _htsPrice;
        htsTokenAddress = _htsToken;
        whitelistedTokens[_htsToken] = true;

        // Initialize valid interests mapping
        for (uint i = 0; i < fixedInterests.length; i++) {
            validInterests[fixedInterests[i]] = true;
        }
    }

    // --- 1. Admin Functions ---

    function setHbarPrice(uint _newPrice) external onlyOwner {
        uint oldPrice = hbarSubscriptionPrice;
        hbarSubscriptionPrice = _newPrice;
        emit HbarPriceSet(oldPrice, _newPrice);
    }

    function setHtsPrice(uint _newPrice) external onlyOwner {
        uint oldPrice = htsSubscriptionPrice;
        htsSubscriptionPrice = _newPrice;
        emit HtsPriceSet(oldPrice, _newPrice);
    }


    function addToWhitelist(address _token) external onlyOwner {
        require(_token != address(0), "EchoinWhispr: Token address cannot be zero");
        whitelistedTokens[_token] = true;
        emit TokenAddedToWhitelist(_token);
    }

    function removeFromWhitelist(address _token) external onlyOwner {
        require(_token != address(0), "EchoinWhispr: Token address cannot be zero");
        whitelistedTokens[_token] = false;
        emit TokenRemovedFromWhitelist(_token);
    }

    function withdrawHBAR() external onlyOwner nonReentrant {
        Address.sendValue(payable(owner), address(this).balance);
    }

    function withdrawHTS() external onlyOwner nonReentrant {
        IERC20 token = IERC20(htsTokenAddress);
        uint balance = token.balanceOf(address(this));
        SafeERC20.safeTransfer(token, owner, balance);
    }

    // --- 2. Core User Functions ---

    /**
     * @dev Registers a new user and creates their persona.
     * Called once upon first login.
     */
    function registerUser(
        string memory _career,
        string[] memory _interests,
        string memory _mood,
        bytes memory _publicKey,
        bytes32 _mailHash
    ) external userDoesNotExist {
        require(_mailHash != bytes32(0), "EchoinWhispr: Mail hash cannot be zero");
        require(_publicKey.length > 0, "EchoinWhispr: Public key cannot be empty");
        require(userIndex.length < type(uint128).max, "EchoinWhispr: Max users reached");

        _validateString(_career, 100);
        require(_interests.length <= 10, "EchoinWhispr: Too many interests");
        for (uint i = 0; i < _interests.length; i++) {
            _validateString(_interests[i], 50);
            require(validInterests[_interests[i]], "EchoinWhispr: Invalid interest");
        }
        _validateString(_mood, 50);

        UserProfile storage profile = users[msg.sender];
        profile.career = _career;
        profile.currentMood = _mood;
        profile.publicKey = _publicKey;
        profile.mailHash = _mailHash;
        profile.subscriptionEnds = 0; // Not subscribed by default
        profile.isInitialized = true;

        for (uint i = 0; i < _interests.length; i++) {
            profile.interests[_interests[i]] = true;
        }

        userIndex.push(msg.sender);
        emit UserRegistered(msg.sender);
    }

    /**
     * @dev Allows an existing user to update their persona.
     * Note: mailHash and publicKey are considered permanent and cannot be edited.
     */
    function editUserPersona(
        string memory _career,
        string[] memory _interests,
        string memory _mood
    ) external userExists {
        _validateString(_career, 100);
        require(_interests.length <= 10, "EchoinWhispr: Too many interests");
        for (uint i = 0; i < _interests.length; i++) {
            _validateString(_interests[i], 50);
            require(validInterests[_interests[i]], "EchoinWhispr: Invalid interest");
        }
        _validateString(_mood, 50);

        UserProfile storage profile = users[msg.sender];
        profile.career = _career;
        // Clear existing interests
        for (uint i = 0; i < fixedInterests.length; i++) {
            profile.interests[fixedInterests[i]] = false;
        }
        // Set new interests
        for (uint i = 0; i < _interests.length; i++) {
            profile.interests[_interests[i]] = true;
        }
        profile.currentMood = _mood;
        emit PersonaUpdated(msg.sender);
    }

    // --- 3. Subscription Functions ---

    /**
     * @dev Grants subscription status to a user for 30 days.
     * Internal function called by payment functions.
     */
    function _grantSubscription(address _user) internal {
        uint newExpiry = block.timestamp + 30 days;

        // Handle renewal: if already subscribed, add 30 days to existing sub
        if (users[_user].subscriptionEnds > block.timestamp) {
            newExpiry = users[_user].subscriptionEnds + 30 days;
        }

        // Cap max subscription duration to 1 year (365 days)
        uint maxExpiry = block.timestamp + 365 days;
        if (newExpiry > maxExpiry) {
            newExpiry = maxExpiry;
        }

        users[_user].subscriptionEnds = newExpiry;
        emit SubscriptionGranted(_user, newExpiry);
    }

    /**
     * @dev Subscribes a user by accepting HBAR.
     */
    function subscribeWithHBAR() external payable userExists {
        require(msg.value >= hbarSubscriptionPrice, "EchoinWhispr: Insufficient HBAR amount sent");
        if (msg.value > hbarSubscriptionPrice) {
            (bool success, ) = payable(msg.sender).call{value: msg.value - hbarSubscriptionPrice}("");
            require(success, "EchoinWhispr: HBAR refund failed");
        }
        _grantSubscription(msg.sender);
    }

    /**
     * @dev Subscribes a user by accepting an HTS token.
     * User MUST have approved the contract as a spender first.
     */
    function subscribeWithHTS() external userExists nonReentrant {
        IERC20 token = IERC20(htsTokenAddress);

        // Pull the tokens from the user's wallet to this contract using SafeERC20
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), htsSubscriptionPrice);

        _grantSubscription(msg.sender);
    }

    // --- 4. Read Functions (View) ---

    /**
     * @dev Checks if a user's subscription is currently active.
     */
    function checkSubscription(address _user) external view returns (bool) {
        return users[_user].subscriptionEnds > block.timestamp;
    }

    /**
     * @dev Retrieves a user's full anonymous persona.
     * Used by the client to display profiles.
     */
    function getPersona(address _user) external view returns (UserProfileView memory) {
        UserProfile storage profile = users[_user];
        string[] memory interestsArray = new string[](fixedInterests.length);
        uint count = 0;
        for (uint i = 0; i < fixedInterests.length; i++) {
            if (profile.interests[fixedInterests[i]]) {
                interestsArray[count] = fixedInterests[i];
                count++;
            }
        }
        return UserProfileView({
            career: profile.career,
            interests: interestsArray,
            interestsCount: count,
            currentMood: profile.currentMood,
            publicKey: profile.publicKey,
            mailHash: profile.mailHash,
            subscriptionEnds: profile.subscriptionEnds,
            isInitialized: profile.isInitialized
        });
    }

    /**
     * @dev Retrieves the public encryption key for a user.
     */
    function getPublicKey(address _user) external view userInitialized(_user) returns (bytes memory) {
        return users[_user].publicKey;
    }

    /**
     * @dev Retrieves the static, anonymous mail hash for a user.
     */
    function getMailHash(address _user) external view userInitialized(_user) returns (bytes32) {
        return users[_user].mailHash;
    }

    /**
     * @dev Finds a random match based on mood.
     * NOTE: On-chain randomness is insecure for value. For matching, it is acceptable.
     * WARNING: This function uses block.timestamp for randomness, which is vulnerable to front-running.
     * Consider using Chainlink VRF for production-grade randomness.
     */
    function findMoodMatch(string memory _mood) external view returns (address) {
        address matchedUser = address(0);
        uint count = 0;
        uint maxIterations = 1000;
        address[] memory matches = new address[](maxIterations);

        uint loopLimit = userIndex.length < maxIterations ? userIndex.length : maxIterations;
        for (uint i = 0; i < loopLimit; i++) {
            address user = userIndex[i];
            // Find users with the same mood, who are not the caller
            if (keccak256(bytes(users[user].currentMood)) == keccak256(bytes(_mood)) && user != msg.sender) {
                if (count < maxIterations) {
                    matches[count] = user;
                    count++;
                }
            }
        }

        if (count > 0) {
            uint randomIndex = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % count;
            matchedUser = matches[randomIndex];
        }

        return matchedUser; // Returns address(0) if no match is found
    }

    /**
     * @dev Returns the total number of registered users.
     * Used for client-side iteration for search.
     */
    function getUserCount() external view returns (uint) {
        return userIndex.length;
    }

    /**
     * @dev Returns a paginated list of user addresses.
     * Used by the client to fetch all users for client-side search filtering.
     * Gas limits are mitigated by pagination.
     */
    function getUsers(uint _page, uint _pageSize) external view returns (address[] memory) {
        uint total = userIndex.length;
        uint startIndex = _page * _pageSize;
        if (startIndex >= total) {
            return new address[](0); // Return empty array if page is out of bounds
        }

        uint endIndex = startIndex + _pageSize;
        if (endIndex > total) {
            endIndex = total;
        }

        address[] memory page = new address[](endIndex - startIndex);
        for(uint i = startIndex; i < endIndex; i++) {
            page[i - startIndex] = userIndex[i];
        }
        return page;
    }
}