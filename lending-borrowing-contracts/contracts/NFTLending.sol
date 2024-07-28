// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTLending is ERC721Holder, ReentrancyGuard, Ownable {
    struct Loan {
        address borrower;
        uint256 tokenId;
        uint256 loanAmount;
        uint256 interestRate;
        uint256 duration;
        uint256 startTime;
        bool repaid;
    }

    IERC721 public nftContract;
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public borrowerLoans;

    event LoanCreated(uint256 indexed tokenId, address indexed borrower, uint256 loanAmount, uint256 interestRate, uint256 duration);
    event LoanRepaid(uint256 indexed tokenId, address indexed borrower, uint256 amount);

    constructor(address initialOwner, address _nftContract) Ownable(initialOwner){
        nftContract = IERC721(_nftContract);
    }

    function createLoan(uint256 tokenId, uint256 loanAmount, uint256 interestRate, uint256 duration) external nonReentrant {
        require(nftContract.ownerOf(tokenId) == msg.sender, "You do not own this NFT");
        require(nftContract.isApprovedForAll(msg.sender, address(this)) || nftContract.getApproved(tokenId) == address(this), "Contract not approved to transfer NFT");

        nftContract.safeTransferFrom(msg.sender, address(this), tokenId);

        loans[tokenId] = Loan({
            borrower: msg.sender,
            tokenId: tokenId,
            loanAmount: loanAmount,
            interestRate: interestRate,
            duration: duration,
            startTime: block.timestamp,
            repaid: false
        });

        borrowerLoans[msg.sender].push(tokenId);

        // Send the loan amount to the borrower
        payable(msg.sender).transfer(loanAmount);

        emit LoanCreated(tokenId, msg.sender, loanAmount, interestRate, duration);
    }

    function repayLoan(uint256 tokenId) external payable nonReentrant {
        Loan storage loan = loans[tokenId];
        require(loan.borrower == msg.sender, "You are not the borrower");
        require(!loan.repaid, "Loan already repaid");
        require(block.timestamp <= loan.startTime + loan.duration, "Loan duration expired");

        uint256 interest = (loan.loanAmount * loan.duration * loan.interestRate) / (100 * 365 * 24 * 60 * 60);
        uint256 totalRepayment = loan.loanAmount + interest;

        require(msg.value == totalRepayment, "Incorrect repayment amount");

        loan.repaid = true;

        nftContract.safeTransferFrom(address(this), loan.borrower, tokenId);

        emit LoanRepaid(tokenId, msg.sender, msg.value);
    }

    function liquidateLoan(uint256 tokenId) external onlyOwner nonReentrant {
        Loan storage loan = loans[tokenId];
        require(!loan.repaid, "Loan already repaid");
        require(block.timestamp > loan.startTime + loan.duration, "Loan duration not expired");

        nftContract.safeTransferFrom(address(this), owner(), tokenId);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
