// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTLending {
    struct Loan {
        address borrower;
        address lender;
        uint256 amount;
        uint256 interest;
        uint256 duration;
        uint256 startTime;
        bool repaid;
    }

    mapping(uint256 => Loan) public loans;
    IERC721 public nftContract;

    constructor(address _nftContract) {
        nftContract = IERC721(_nftContract);
    }

    function createLoan(uint256 _tokenId, uint256 _amount, uint256 _interest, uint256 _duration) external {
        require(nftContract.ownerOf(_tokenId) == msg.sender, "You do not own this NFT");
        nftContract.transferFrom(msg.sender, address(this), _tokenId);

        loans[_tokenId] = Loan({
            borrower: msg.sender,
            lender: address(0),
            amount: _amount,
            interest: _interest,
            duration: _duration,
            startTime: 0,
            repaid: false
        });
    }

    function fundLoan(uint256 _tokenId) external payable {
        Loan storage loan = loans[_tokenId];
        require(loan.lender == address(0), "Loan already funded");
        require(msg.value == loan.amount, "Incorrect loan amount");

        loan.lender = msg.sender;
        loan.startTime = block.timestamp;

        payable(loan.borrower).transfer(loan.amount);
    }

    function repayLoan(uint256 _tokenId) external payable {
        Loan storage loan = loans[_tokenId];
        require(msg.sender == loan.borrower, "You are not the borrower");
        require(!loan.repaid, "Loan already repaid");
        require(block.timestamp <= loan.startTime + loan.duration, "Loan duration exceeded");

        uint256 repaymentAmount = loan.amount + loan.interest;
        require(msg.value == repaymentAmount, "Incorrect repayment amount");

        loan.repaid = true;
        nftContract.transferFrom(address(this), loan.borrower, _tokenId);
        payable(loan.lender).transfer(repaymentAmount);
    }

    function claimNFT(uint256 _tokenId) external {
        Loan storage loan = loans[_tokenId];
        require(msg.sender == loan.lender, "You are not the lender");
        require(!loan.repaid, "Loan already repaid");
        require(block.timestamp > loan.startTime + loan.duration, "Loan duration not yet exceeded");

        nftContract.transferFrom(address(this), loan.lender, _tokenId);
    }
}